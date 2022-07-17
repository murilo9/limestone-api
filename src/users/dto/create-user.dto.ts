import { IsDefined, IsEmail, IsString } from 'class-validator';
import { UserRole } from '../types/user-role';

export class CreateUserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsEmail()
  email: string;
  @IsString()
  role: UserRole.admin | UserRole.member;
}
