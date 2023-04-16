import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordChangeDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
