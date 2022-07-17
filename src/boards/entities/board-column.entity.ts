import PersistentEntity from 'src/common/types/persistent-entity';
import { Card } from './card.entity';

export interface BoardColumn extends PersistentEntity {
  title: string;
  cards: Card[];
}
