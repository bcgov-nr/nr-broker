import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createClient, createCluster } from 'redis';

import { BrokerAccountDto } from './dto/broker-account.dto';
import { CollectionConfigDto } from './dto/collection-config.dto';
import { ConnectionConfigDto } from './dto/connection-config.dto';
import { EdgeDto } from './dto/edge.dto';
import { EnvironmentDto } from './dto/environment.dto';
import { GraphPermissionDto } from './dto/graph-permission.dto';
import { IntentionDto } from '../intention/dto/intention.dto';
import { JwtAllowDto } from './dto/jwt-allow.dto';
import { JwtBlockDto } from './dto/jwt-block.dto';
import { JwtRegistryDto } from './dto/jwt-registry.dto';
import { PackageBuildDto } from './dto/package-build.dto';
import { PreferenceDto } from './dto/preference.dto';
import { ProjectDto } from './dto/project.dto';
import { ServerDto } from './dto/server.dto';
import { ServiceDto } from './dto/service.dto';
import { ServiceInstanceDto } from './dto/service-instance.dto';
import { TeamDto } from './dto/team.dto';
import { UserAliasRequestDto } from './dto/user-alias-request.dto';
import { UserDto } from './dto/user.dto';
import { VertexDto } from './dto/vertex.dto';

import { BuildRepository } from './interfaces/build.repository';
import { CollectionRepository } from './interfaces/collection.repository';
import { GraphRepository } from './interfaces/graph.repository';
import { IntentionRepository } from './interfaces/intention.repository';
import { SystemRepository } from './interfaces/system.repository';

import { BuildMongoRepository } from './mongo/build-mongo.repository';
import { CollectionMongoRepository } from './mongo/collection-mongo.repository';
import { GraphMongoRepository } from './mongo/graph-mongo.repository';
import { IntentionMongoRepository } from './mongo/intention-mongo.repository';
import { SystemMongoRepository } from './mongo/system-mongo.repository';

import { GraphRedisRepository } from './redis-composition/graph-redis.repository';

import { PersistenceUtilService } from './persistence-util.service';
import { PersistenceRedisUtilService } from './persistence-redis-util.service';
import { UtilModule } from '../util/util.module';

const redisFactory = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const host = process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost';
    const replics = process.env.REDIS_REPLICAS;
    const port = process.env.REDIS_PORT ? process.env.REDIS_PORT : '6379';
    const username = process.env.REDIS_USER ? process.env.REDIS_USER : '';
    const password = process.env.REDIS_PASSWORD
      ? `:${process.env.REDIS_PASSWORD}`
      : '';
    const url = `redis://${username}${password}${
      username.length > 0 || password.length > 0 ? '@' : ''
    }${host}:${port}`;
    const client = replics
      ? createCluster({
          rootNodes: [{ url }],
          useReplicas: true,
        })
      : createClient({ url });
    client.on('error', (err) => {
      logger.error('Redis client error');
      logger.error(err);
    });
    await client.connect();
    logger.log('Redis client connected');
    return client;
  },
};

/**
 * The persistence module provides interfaces to store, retrieve and query data.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BrokerAccountDto,
      CollectionConfigDto,
      ConnectionConfigDto,
      EdgeDto,
      EnvironmentDto,
      GraphPermissionDto,
      IntentionDto,
      JwtAllowDto,
      JwtBlockDto,
      JwtRegistryDto,
      ServiceDto,
      ServiceInstanceDto,
      PackageBuildDto,
      PreferenceDto,
      ProjectDto,
      ServerDto,
      TeamDto,
      UserAliasRequestDto,
      UserDto,
      VertexDto,
    ]),
    UtilModule,
  ],
  providers: [
    BuildMongoRepository,
    {
      provide: BuildRepository,
      useExisting: BuildMongoRepository,
    },
    CollectionMongoRepository,
    {
      provide: CollectionRepository,
      useExisting: CollectionMongoRepository,
    },
    GraphMongoRepository,
    GraphRedisRepository,
    {
      provide: GraphRepository,
      useExisting: GraphRedisRepository,
    },
    IntentionMongoRepository,
    { provide: IntentionRepository, useExisting: IntentionMongoRepository },
    PersistenceRedisUtilService,
    PersistenceUtilService,
    SystemMongoRepository,
    {
      provide: SystemRepository,
      useExisting: SystemMongoRepository,
    },
    redisFactory,
  ],
  exports: [
    BuildRepository,
    CollectionRepository,
    GraphRepository,
    IntentionRepository,
    PersistenceUtilService,
    SystemRepository,
    redisFactory,
  ],
})
export class PersistenceModule {}
const logger = new Logger(PersistenceModule.name);
