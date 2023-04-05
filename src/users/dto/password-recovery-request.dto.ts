import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordRecoveryRequestDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  email: string;
}
