import PersistentEntity from 'src/common/types/persistent-entity';

export interface CardComment extends PersistentEntity {
  author: string;
  body: string;
}
