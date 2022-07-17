import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { UserNotificationOptions } from '../types/user-notification-options';
import { UserPermissions } from '../types/user-permissions';
import { UserRole } from '../types/user-role';

export class UpdateUserDto {
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsEnum(UserRole)
  role: UserRole;
  @ValidateNested()
  boardsPermissions: UserPermissions;
  @ValidateNested()
  notificationOptions: UserNotificationOptions;
}
