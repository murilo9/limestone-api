import { ObjectId } from 'mongodb';
import PersistentEntity from '../../common/types/persistent-entity';

export interface CardComment extends PersistentEntity {
  cardId: ObjectId;
  author: ObjectId;
  body: string;
}
