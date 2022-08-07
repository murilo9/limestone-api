import { ObjectId } from 'mongodb';

export default interface PersistentEntity {
  _id: ObjectId;
  created: Date;
  updated: Date;
}
