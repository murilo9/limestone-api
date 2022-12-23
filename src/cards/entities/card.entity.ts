import { ObjectId } from 'mongodb';
import PersistentEntity from '../../common/types/persistent-entity';
import { CardComment } from '../../boards/entities/card-comment.entity';

export interface Card extends PersistentEntity {
  columnId: ObjectId;
  title: string;
  assignee: ObjectId | null;
  priority: number;
}
