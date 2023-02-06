import { ObjectId } from 'mongodb';
import PersistentEntity from '../../common/types/persistent-entity';

export interface Column extends PersistentEntity {
  title: string;
  boardId: ObjectId;
  index: number;
}
