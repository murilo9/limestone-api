import PersistentEntity from '../../common/types/persistent-entity';

export interface PasswordRecoveryRequest extends PersistentEntity {
  email: string;
}
