import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import ejs from 'ejs';
import { v4 as uuidv4 } from 'uuid';
import { REDIS_QUEUES, CRON_JOB_SEND_COMS } from '../constants';
import { RedisService } from '../redis/redis.service';
import { JobQueueUtil } from '../util/job-queue.util';
import { AuditService } from '../audit/audit.service';
import { CollectionNameEnum } from '../persistence/dto/collection-dto-union.type';
import { GraphRepository } from '../persistence/interfaces/graph.repository';
import { UserDto } from '../persistence/dto/user.dto';
import { CommunicationTaskService } from './communication-task.service';
import { COMMUNICATION_TASKS } from './communication.constants';

interface CommunicationUserRef {
  ref: 'upstream';
  value: string;
  optional?: boolean;
}

interface CommunicationJob {
  uuid: string;
  vertexId: string;
  toUsers: CommunicationUserRef[];
  optionalUsers: CommunicationUserRef[];
  template: string;
  context: ejs.Data;
}

@Injectable()
export class CommunicationQueueService {
  constructor(
    private readonly auditService: AuditService,
    @Inject(COMMUNICATION_TASKS)
    private readonly communicationTasks: Array<CommunicationTaskService>,
    private readonly graphRepository: GraphRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly redisService: RedisService,
    private readonly jobQueueUtil: JobQueueUtil,
    private readonly orm: MikroORM,
  ) {}

  queue(
    type: string,
    vertexId: string,
    toUsers: CommunicationUserRef[],
    template: string,
    context: ejs.Data,
  ): Promise<void> {
    const job = {
      uuid: uuidv4(),
      type,
      vertexId,
      toUsers,
      template,
      context,
    };
    this.auditService.recordCommunications(
      job.uuid,
      `Communication queued: ${job.uuid} [${job.type}]`,
      'info',
      'unknown',
      ['communication'],
    );
    return this.redisService.queue(
      REDIS_QUEUES.NOTIFICATION_COMS,
      JSON.stringify(job),
    );
  }

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: CRON_JOB_SEND_COMS,
  })
  @CreateRequestContext()
  async pollQueue(): Promise<void> {
    await this.jobQueueUtil.refreshJobWrap(
      this.schedulerRegistry,
      CRON_JOB_SEND_COMS,
      REDIS_QUEUES.NOTIFICATION_COMS,
      () =>
        this.redisService.dequeue(REDIS_QUEUES.NOTIFICATION_COMS) as Promise<
          string | null
        >,
      async (jobString: string) => {
        let userCount = 0;
        const job = JSON.parse(jobString) as CommunicationJob;
        const notifiedUsers = new Set<string>();
        this.auditService.recordCommunications(
          job.uuid,
          `Communication job: ${job.uuid}`,
          'start',
          'unknown',
          ['communication'],
        );
        const users = await this.getUserArr(job);

        if (users.length === 0) {
          this.auditService.recordCommunications(
            job.uuid,
            `Communication job ${job.uuid} found no users`,
            'end',
            'unknown',
            ['communication'],
          );
          return;
        }

        for (const user of users) {
          if (notifiedUsers.has(user.id)) {
            continue; // Skip if already notified
          }
          notifiedUsers.add(user.id);
          userCount++;
          this.auditService.recordCommunications(
            job.uuid,
            `Communication job for user: ${user.email}`,
            'start',
            'unknown',
            ['communication'],
          );
          try {
            for (const communicationService of this.communicationTasks) {
              await communicationService.send(user, job.template, job.context);
            }
          } catch (error) {
            this.auditService.recordCommunications(
              job.uuid,
              `Failed to send to ${user.email}: ${error.message}`,
              'info',
              'failure',
              ['email', 'communication'],
            );
          }
        }
        this.auditService.recordCommunications(
          job.uuid,
          `Communication job ${job.uuid} completed for ${userCount} users`,
          'end',
          'success',
          ['communication'],
        );
      },
    );
  }

  async getUserArr(job: CommunicationJob): Promise<UserDto[]> {
    const userArr: UserDto[] = [];
    for (const jobUser of job.toUsers) {
      if (jobUser.ref === 'upstream') {
        if (jobUser.optional && userArr.length > 0) {
          continue; // Skip optional users if we already have users
        }
        const users = await this.graphRepository.getUpstreamVertex<UserDto>(
          job.vertexId,
          CollectionNameEnum.user,
          [jobUser.value],
        );

        userArr.push(...users.map((user) => user.collection));
      } else {
        this.auditService.recordCommunications(
          job.uuid,
          `Communication job: ${job.uuid} (Unknown user ref)`,
          'info',
          'unknown',
          ['communication'],
        );
      }
    }
    return userArr;
  }
}
