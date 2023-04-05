import { ObjectId } from 'mongodb';
import PersistentEntity from '../../common/types/persistent-entity';

export interface UserPassword extends PersistentEntity {
  user: ObjectId;
  hash: string;
}
