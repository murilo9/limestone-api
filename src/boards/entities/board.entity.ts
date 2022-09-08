import PersistentEntity from 'src/common/types/persistent-entity';
import { BoardColumn } from './board-column.entity';

export interface Board extends PersistentEntity {
  title: string;
  admin: string;
  createdBy: string;
  columns: BoardColumn[];
  users: string[];
  archived: boolean;
}
