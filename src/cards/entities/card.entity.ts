import { ObjectId } from 'mongodb';
import PersistentEntity from '../../common/types/persistent-entity';

export interface Card extends PersistentEntity {
  columnId: string;
  title: string;
  description: string;
  assignee: ObjectId | null;
  priority: number;
}
