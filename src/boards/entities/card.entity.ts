import PersistentEntity from 'src/common/types/persistent-entity';
import { CardComment } from './card-comment.entity';

export interface Card extends PersistentEntity {
  title: string;
  assignee: string | null;
  priority: number;
  comments: CardComment[];
}
