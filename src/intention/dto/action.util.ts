import { InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DatabaseAccessActionDto } from './database-access-action.dto';
import { PackageConfigureActionDto } from './package-configure-action.dto';
import { PackageInstallationActionDto } from './package-installation-action.dto';
import { PackageProvisionActionDto } from './package-provision-action.dto';
import { ServerAccessActionDto } from './server-access-action.dto';
import { UnknownActionBadRequestException } from './unknown-action-bad-request.exception';

export function actionFactory(object: any) {
  if (!object || typeof object !== 'object') {
    throw new InternalServerErrorException();
  }
  if (object.action === 'database-access') {
    return plainToInstance(
      DatabaseAccessActionDto,
      DatabaseAccessActionDto.plainToInstance(object),
    );
  } else if (object.action === 'server-access') {
    return plainToInstance(
      ServerAccessActionDto,
      ServerAccessActionDto.plainToInstance(object),
    );
  } else if (object.action === 'package-configure') {
    return plainToInstance(
      PackageConfigureActionDto,
      PackageConfigureActionDto.plainToInstance(object),
    );
  } else if (object.action === 'package-installation') {
    return plainToInstance(
      PackageInstallationActionDto,
      PackageInstallationActionDto.plainToInstance(object),
    );
  } else if (object.action === 'package-provision') {
    return plainToInstance(
      PackageProvisionActionDto,
      PackageProvisionActionDto.plainToInstance(object),
    );
  }
  throw new UnknownActionBadRequestException(
    `Unknown intention action: ${object.action}`,
  );
}
