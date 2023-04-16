import { ObjectId } from 'mongodb';
import PersistentEntity from '../../common/types/persistent-entity';
import { SignProvider } from '../types/sign-provider';
import { UserNotificationOptions } from '../types/user-notification-options';

export interface User extends PersistentEntity {
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  createdBy: ObjectId | null; // null = user is admin
  verified: boolean;
  verifyId: string;
  active: boolean;
  notificationOptions: UserNotificationOptions;
  signProvider: SignProvider;
}
