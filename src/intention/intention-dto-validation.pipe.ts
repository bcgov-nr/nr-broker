import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { IntentionDto } from './dto/intention.dto';
import { UnknownActionBadRequestException } from './dto/unknown-action-bad-request.exception';
import { ValidatorUtil } from '../util/validator.util';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class IntentionDtoValidationPipe implements PipeTransform {
  constructor(private readonly validatorUtil: ValidatorUtil) {}
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // Validate as a generic intention
    try {
      const object = plainToInstance(IntentionDto, value);
      const errors = await validate(object, {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      });
      if (errors.length > 0) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Intention validation error',
          error: this.validatorUtil.buildFirstFailedPropertyErrorMsg(errors[0]),
        });
      }
      return object;
    } catch (error) {
      if (
        error instanceof UnknownActionBadRequestException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Validation failed');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
