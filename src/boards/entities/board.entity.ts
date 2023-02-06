import { ObjectId } from 'mongodb';
import PersistentEntity from '../../common/types/persistent-entity';
import { BoardSettings } from '../types/BoardSettings';

export interface Board extends PersistentEntity {
  title: string;
  admin: ObjectId;
  owner: ObjectId;
  users: ObjectId[];
  archived: boolean;
  settings: BoardSettings;
}
