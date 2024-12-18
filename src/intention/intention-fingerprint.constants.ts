import { ServerAccessActionDto } from './dto/server-access-action.dto';
import { DatabaseAccessActionDto } from './dto/database-access-action.dto';
import { PackageProvisionActionDto } from './dto/package-provision-action.dto';
import { PackageInstallationActionDto } from './dto/package-installation-action.dto';
import { ActionDto } from './dto/action.dto';
import { PackageConfigureActionDto } from './dto/package-configure-action.dto';
import { PackageBuildActionDto } from './dto/package-build-action.dto';
import { ProcessStartActionDto } from './dto/process-start-action.dto';
import { ProcessEndActionDto } from './dto/process-end-action.dto';

type ActionDtoType = typeof ActionDto;
export interface IntentionFingerprint {
  name: string;
  dtoClass: ActionDtoType;
  roles: string[];
}

export const FINGERPRINTS: IntentionFingerprint[] = [
  {
    name: 'ServerAccess',
    dtoClass: ServerAccessActionDto,
    roles: ['provision', 'provision/token/self'],
  },
  {
    name: 'DatabaseAccess',
    dtoClass: DatabaseAccessActionDto,
    roles: ['provision', 'provision/token/self'],
  },
  {
    name: 'PackageBuild',
    dtoClass: PackageBuildActionDto,
    roles: ['provision', 'provision/token/self'],
  },
  {
    name: 'PackageConfigure',
    dtoClass: PackageConfigureActionDto,
    roles: ['provision', 'provision/token/self'],
  },
  {
    name: 'PackageInstallation',
    dtoClass: PackageInstallationActionDto,
    roles: [],
  },
  {
    name: 'PackageProvision',
    dtoClass: PackageProvisionActionDto,
    roles: ['provision', 'provision/approle/secret-id'],
  },
  {
    name: 'ProcessStart',
    dtoClass: ProcessStartActionDto,
    roles: [],
  },
  {
    name: 'ProcessEnd',
    dtoClass: ProcessEndActionDto,
    roles: [],
  },
];
