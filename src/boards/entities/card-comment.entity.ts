import PersistentEntity from '../../common/types/persistent-entity';

export interface CardComment extends PersistentEntity {
  author: string;
  body: string;
}
