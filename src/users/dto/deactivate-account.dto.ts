import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeactivateAccountDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;
}
