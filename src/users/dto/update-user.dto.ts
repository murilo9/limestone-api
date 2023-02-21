import { Expose } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { UserNotificationOptions } from '../types/user-notification-options';

export class UpdateUserDto {
  @Expose()
  @IsString()
  firstName: string;
  @Expose()
  @IsString()
  lastName: string;
  @Expose()
  @ValidateNested()
  notificationOptions: UserNotificationOptions;
}
