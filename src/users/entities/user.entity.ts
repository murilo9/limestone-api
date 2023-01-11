import { ObjectId } from 'mongodb';
import PersistentEntity from '../../common/types/persistent-entity';
import { UserNotificationOptions } from '../types/user-notification-options';

export interface User extends PersistentEntity {
  email: string;
  firstName: string;
  lastName: string;
  createdBy: ObjectId | null; // null = user is admin
  verified: boolean;
  verifyId: string;
  active: boolean;
  notificationOptions: UserNotificationOptions;
}
