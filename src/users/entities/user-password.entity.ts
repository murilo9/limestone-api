import PersistentEntity from 'src/common/types/persistent-entity';

export interface UserPassword extends PersistentEntity {
  user: string;
  hash: string;
}
