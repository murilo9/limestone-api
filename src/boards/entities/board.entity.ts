import { ObjectId } from 'mongodb';
import PersistentEntity from '../../common/types/persistent-entity';
import { BoardColumn } from './board-column.entity';

export interface Board extends PersistentEntity {
  title: string;
  admin: ObjectId;
  owner: ObjectId;
  columns: BoardColumn[];
  users: ObjectId[];
  archived: boolean;
}
