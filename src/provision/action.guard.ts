import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { HEADER_BROKER_TOKEN } from '../constants';
import { PersistenceService } from '../persistence/persistence.service';
import { ActionGuardRequest } from './action-guard-request.interface';
import { IntentionDto } from '../intention/dto/intention.dto';
import { validate } from 'class-validator';

@Injectable()
export class ActionGuard implements CanActivate {
  constructor(private persistenceService: PersistenceService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ActionGuardRequest>();
    const tokenHeader = request.headers[HEADER_BROKER_TOKEN];
    const token =
      typeof tokenHeader === 'string' ? tokenHeader : tokenHeader[0];

    const action = IntentionDto.actionFactory(
      await this.persistenceService.getIntentionAction(token),
    );
    const errors = await validate(action, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });
    if (errors.length > 0) {
      console.log(errors[0].children);
      throw new BadRequestException('Validation failed');
    }
    request.brokerActionDto = action;
    return !!action;
  }
}
