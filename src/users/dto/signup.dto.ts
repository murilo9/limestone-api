import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @Expose()
  @IsEmail()
  email: string;
  @Expose()
  @IsEmail()
  emailAgain: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  password: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  passwordAgain: string;
}
