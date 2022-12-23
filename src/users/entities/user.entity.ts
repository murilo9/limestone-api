import { ObjectId } from 'mongodb';
import PersistentEntity from '../../common/types/persistent-entity';
import { UserNotificationOptions } from '../types/user-notification-options';
import { UserRole } from '../types/user-role';

export interface User extends PersistentEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdBy: ObjectId | null;
  verified: boolean;
  verifyId: string;
  active: boolean;
  notificationOptions: UserNotificationOptions;
}
