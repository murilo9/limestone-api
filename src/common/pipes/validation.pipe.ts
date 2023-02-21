/* eslint-disable @typescript-eslint/ban-types */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private dtoClass: any) {}

  async transform(value: any): Promise<any> {
    const transformed = plainToInstance(this.dtoClass, value, {
      excludeExtraneousValues: true,
    });
    console.log(this.dtoClass, transformed, value);
    const errors = await validate(transformed);

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return transformed;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
