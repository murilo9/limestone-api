import PersistentEntity from '../../common/types/persistent-entity';

export interface UserPassword extends PersistentEntity {
  user: string;
  hash: string;
}
