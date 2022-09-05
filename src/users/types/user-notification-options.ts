export class UserNotificationOptions {
  allBoards: {
    onCreate: boolean; // When any board is created by someone else
    onUpdate: boolean; // When any board is updated by someone else
    onInsertMe: boolean; // When I'm inserted into a board by someone else
    onRemoveMe: boolean; // When I'm removed from a board by someone else
  };
  // When a card assigned to me is created/updated/deleted by someone else
  myCards: {
    onCreate: boolean;
    onUpdate: boolean;
    onDelete: boolean;
  };
  // When a board I'm member of is created/updated/deleted by someone else
  myBoardCards: {
    onCreate: boolean;
    onUpdate: boolean;
    onDelete: boolean;
  };
}
