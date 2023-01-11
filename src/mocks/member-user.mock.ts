import { ObjectId } from 'mongodb';
import { User } from '../users/entities/user.entity';
import { adminUser } from './admin-user.mock';

export const memberUser: User = {
  email: '',
  firstName: '',
  lastName: '',
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
};
