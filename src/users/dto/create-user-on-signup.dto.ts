import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsString, IsUUID } from 'class-validator';
export class CreateUserOnSignUpDto {
  @Expose()
  @IsString()
  firstName: string;
  @Expose()
  @IsString()
  lastName: string;
  @Expose()
  @IsEmail()
  email: string;
  @Expose()
  @IsString()
  password: string;
}
