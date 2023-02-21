import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @Expose()
  @IsEmail()
  email: string;
  @Expose()
  @IsString()
  password: string;
}
