import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ENVIRONMENT_NAMES } from '../entity/action.embeddable';

export class ServiceTargetDto {
  @IsString()
  @IsDefined()
  environment: ENVIRONMENT_NAMES;

  // Defaults to environment
  @IsString()
  @IsOptional()
  instanceName?: string;

  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  project: string;
}
