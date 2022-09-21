import { IsDefined, IsEmail, IsString, IsUUID } from 'class-validator';
export class CreateUserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsUUID()
  adminId?: string;
}
