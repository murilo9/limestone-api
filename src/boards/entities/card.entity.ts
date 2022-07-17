import PersistentEntity from 'src/common/types/persistent-entity';

export interface Card extends PersistentEntity {
  title: string;
  assignee: string | null;
  priority: number;
}
