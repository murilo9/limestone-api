import { ObjectId } from 'mongodb';

export interface BoardSettings {
  canCreateCards: ObjectId[];
  canCommentOnCards: ObjectId[];
}
