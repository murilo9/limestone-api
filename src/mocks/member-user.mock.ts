import { ObjectId } from 'mongodb';
import { User } from '../users/entities/user.entity';
import { SignProvider } from '../users/types/sign-provider';
import { adminUser } from './admin-user.mock';

export const memberUser: User = {
  email: '',
  firstName: '',
  lastName: '',
  title: '',
  createdBy: adminUser._id,
  verified: false,
  verifyId: '',
  active: false,
  notificationOptions: {
    allBoards: {
      onCreate: false,
      onUpdate: false,
      onInsertMe: true,
      onRemoveMe: true,
    },
    myCards: {
      onCreate: true,
      onUpdate: true,
      onDelete: true,
    },
    myBoardCards: {
      onCreate: true,
      onUpdate: true,
      onDelete: true,
    },
  },
  _id: new ObjectId(0),
  created: undefined,
  updated: undefined,
  signProvider: SignProvider.NONE,
};
