import { ObjectId } from 'mongodb';
import PersistentEntity from '../../common/types/persistent-entity';

export interface Card extends PersistentEntity {
  columnId: ObjectId;
  index: number;
  title: string;
  description: string;
  assignee: ObjectId | null;
  priority: number;
}
