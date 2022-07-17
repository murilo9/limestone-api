import { AllBoardsPermissions } from './all-boards-permissions';
import { UserPermissions } from './user-permissions';

export class UserNotificationOptions {
  allBoards: AllBoardsPermissions;
  // When a card assigned to me is created/updated/deleted by someone else
  myCards: UserPermissions;
  // When a board I'm member of is created/updated/deleted by someone else
  myBoardCards: UserPermissions;
}
