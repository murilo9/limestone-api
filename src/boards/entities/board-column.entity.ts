import PersistentEntity from '../../common/types/persistent-entity';
import { Card } from '../../cards/entities/card.entity';

export interface BoardColumn {
  _id: string;
  title: string;
  cardCount: number;
}
