import { IsDefined, IsEmail, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsEmail()
  email: string;
  @IsEmail()
  emailAgain: string;
  @IsString()
  password: string;
  @IsString()
  passwordAgain: string;
}
