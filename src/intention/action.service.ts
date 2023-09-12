import { Injectable } from '@nestjs/common';
import { ActionError } from './action.error';
import { ActionUtil } from './action.util';
import { ActionDto } from './dto/action.dto';
import { DatabaseAccessActionDto } from './dto/database-access-action.dto';
import { IntentionDto } from './dto/intention.dto';
import { BrokerAccountProjectMapDto } from '../persistence/dto/graph-data.dto';
import { BrokerAccountDto } from '../persistence/dto/broker-account.dto';
import { GraphRepository } from '../persistence/interfaces/graph.repository';
import { CollectionRepository } from '../persistence/interfaces/collection.repository';
import {
  ACTION_VALIDATE_TEAM_ADMIN,
  ACTION_VALIDATE_TEAM_DBA,
} from '../constants';
import { UserDto } from '../persistence/dto/user.dto';
import { UserCollectionService } from '../collection/user-collection.service';
import { PersistenceUtilService } from '../persistence/persistence-util.service';
import { PackageInstallationActionDto } from './dto/package-installation-action.dto';

/**
 * Assists with the validation of intention actions
 */
@Injectable()
export class ActionService {
  constructor(
    private readonly actionUtil: ActionUtil,
    private readonly collectionRepository: CollectionRepository,
    private readonly userCollectionService: UserCollectionService,
    private readonly graphRepository: GraphRepository,
    private readonly persistenceUtil: PersistenceUtilService,
  ) {}

  public async bindUserToAction(
    account: BrokerAccountDto | null,
    action: ActionDto,
  ) {
    let user: UserDto;
    if (!action.user) {
      return;
    }

    if (action.user.id) {
      user = await this.userCollectionService.lookupUserByGuid(action.user.id);
    } else if (action.user.name) {
      user = await this.userCollectionService.lookupUserByName(
        action.user.name,
        action.user.domain,
      );
    }

    if (user) {
      action.user.domain = user.domain;
      action.user.email = user.email;
      action.user.full_name = user.name;
      action.user.id = user.guid;
      action.user.name = user.username;
    }

    if (account) {
      action.user.group.id = account.id.toString();
      action.user.group.name = account.name;
      action.user.group.domain = 'broker';
    }
  }

  public async validate(
    intention: IntentionDto,
    action: ActionDto,
    account: BrokerAccountDto | null,
    accountBoundProjects: BrokerAccountProjectMapDto | null,
    requireProjectExists: boolean,
    requireServiceExists: boolean,
  ): Promise<ActionError> | null {
    const user = await this.userCollectionService.lookupUserByGuid(
      action.user?.id,
    );

    return (
      (await this.validateUserSet(user, action)) ??
      (await this.validateVaultEnv(action)) ??
      (await this.validateAccountBoundProject(
        action,
        accountBoundProjects,
        requireProjectExists,
        requireServiceExists,
      )) ??
      (await this.validateDbAction(user, intention, action)) ??
      (await this.validatePackageAction(user, intention, action)) ??
      null
    );
  }

  private async validateUserSet(
    user: any,
    action: ActionDto,
  ): Promise<ActionError> | null {
    if (!user) {
      return {
        message:
          'Unknown user. All actions required to have a user id or name and domain set.',
        data: {
          action: action.action,
          action_id: action.id,
          key: 'action.user.id',
          value: action.service.environment,
        },
      };
    }
  }

  private async validateVaultEnv(
    action: ActionDto,
  ): Promise<ActionError> | null {
    if (
      this.actionUtil.isProvisioned(action) &&
      !this.actionUtil.isValidVaultEnvironment(action)
    ) {
      return {
        message:
          'Explicitly set action.vaultEnvironment when service environment is not valid for Vault. Vault environment must be production, test or development.',
        data: {
          action: action.action,
          action_id: action.id,
          key: 'action.service.environment',
          value: action.service.environment,
        },
      };
    }
  }

  private async validateAccountBoundProject(
    action: ActionDto,
    accountBoundProjects: BrokerAccountProjectMapDto | null,
    requireProjectExists: boolean,
    requireServiceExists: boolean,
  ): Promise<ActionError> | null {
    if (accountBoundProjects) {
      const projectFound = !!accountBoundProjects[action.service.project];
      const serviceFound =
        projectFound &&
        accountBoundProjects[action.service.project].services.indexOf(
          action.service.name,
        ) !== -1;

      if (!projectFound && requireProjectExists) {
        return {
          message: 'Token not authorized for this project',
          data: {
            action: action.action,
            action_id: action.id,
            key: 'action.service.project',
            value: action.service.project,
          },
        };
      }
      if (!serviceFound && requireServiceExists) {
        return {
          message: 'Token not authorized for this service',
          data: {
            action: action.action,
            action_id: action.id,
            key: 'action.service.name',
            value: action.service.name,
          },
        };
      }
    }
  }

  private async validateDbAction(
    user: any,
    intention: IntentionDto,
    action: ActionDto,
  ): Promise<ActionError> | null {
    if (action instanceof DatabaseAccessActionDto) {
      if (
        (await this.persistenceUtil.testAccess(
          ['developer', 'lead-developer'],
          user.vertex.toString(),
          ACTION_VALIDATE_TEAM_ADMIN,
          false,
        )) ||
        (await this.persistenceUtil.testAccess(
          ['developer', 'lead-developer'],
          user.vertex.toString(),
          ACTION_VALIDATE_TEAM_DBA,
          false,
        ))
      ) {
        return null;
      }
      return this.validateAssistedDelivery(user, intention, action);
    }
    return null;
  }

  private async validatePackageAction(
    user: any,
    intention: IntentionDto,
    action: ActionDto,
  ): Promise<ActionError> | null {
    if (action instanceof PackageInstallationActionDto) {
      if (
        await this.persistenceUtil.testAccess(
          ['developer', 'lead-developer'],
          user.vertex.toString(),
          ACTION_VALIDATE_TEAM_ADMIN,
          false,
        )
      ) {
        return null;
      }

      return this.validateAssistedDelivery(user, intention, action);
    }
    return null;
  }

  private async validateAssistedDelivery(
    user: any,
    intention: IntentionDto,
    action: ActionDto,
  ): Promise<ActionError> | null {
    const project = await this.collectionRepository.getCollectionByKeyValue(
      'project',
      'name',
      action.service.project,
    );
    const service = await this.collectionRepository.getCollectionByKeyValue(
      'service',
      'name',
      action.service.name,
    );

    if (!project || !service) {
      return null;
    }

    if (
      await this.persistenceUtil.testAccess(
        ['developer', 'lead-developer'],
        user.vertex.toString(),
        service.vertex.toString(),
        true,
      )
    ) {
      const vertex = await this.graphRepository.getEdgeByNameAndVertices(
        'component',
        project.vertex.toString(),
        service.vertex.toString(),
      );

      if (
        vertex &&
        vertex.prop &&
        vertex.prop[`ad-${action.service.environment}`] === 'true'
      ) {
        return {
          message: 'User is not authorized to access this environment',
          data: {
            action: action.action,
            action_id: action.id,
            key: 'user.id',
            value: intention.user.id,
          },
        };
      } else {
        return null;
      }
    } else {
      return {
        message: 'User is not authorized to do this action',
        data: {
          action: action.action,
          action_id: action.id,
          key: 'user.id',
          value: intention.user.id,
        },
      };
    }
  }
}
