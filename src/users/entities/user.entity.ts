import PersistentEntity from 'src/common/types/persistent-entity';
import { UserNotificationOptions } from '../types/user-notification-options';
import { UserRole } from '../types/user-role';

export interface User extends PersistentEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdBy: string | null;
  verified: boolean;
  verifyId: string;
  active: boolean;
  notificationOptions: UserNotificationOptions;
}
