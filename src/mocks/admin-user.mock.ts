import { ObjectId } from 'mongodb';
import { User } from '../users/entities/user.entity';

export const adminUser: User = {
  email: '',
  firstName: '',
  lastName: '',
  createdBy: null,
  verified: false,
  verifyId: '',
  active: false,
  notificationOptions: {
    allBoards: {
      onCreate: true,
      onUpdate: true,
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
