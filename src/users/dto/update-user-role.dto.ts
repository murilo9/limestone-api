import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { UserNotificationOptions } from '../types/user-notification-options';
import { UserRole } from '../types/user-role';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
