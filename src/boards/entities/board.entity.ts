import { ObjectId } from 'mongodb';
import PersistentEntity from 'src/common/types/persistent-entity';
import { BoardColumn } from './board-column.entity';

export interface Board extends PersistentEntity {
  title: string;
  admin: ObjectId;
  owner: ObjectId;
  columns: BoardColumn[];
  users: string[];
  archived: boolean;
}
