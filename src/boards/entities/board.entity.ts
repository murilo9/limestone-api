import PersistentEntity from 'src/common/types/persistent-entity';
import { BoardColumn } from './board-column.entity';

export interface Board extends PersistentEntity {
  title: string;
  owner: string;
  createdBy: string;
  permissions: {
    // Which users (IDs) can do what on this board
    createCard: string[];
    updateCard: string[];
    deleteCard: string[];
  };
  columns: BoardColumn[];
  users: string[];
  archived: boolean;
}
