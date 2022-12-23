import PersistentEntity from 'src/common/types/persistent-entity';
import { Card } from '../../cards/entities/card.entity';

export interface BoardColumn
  extends Omit<PersistentEntity, 'created' | 'updated'> {
  title: string;
  cardCount: number;
}
