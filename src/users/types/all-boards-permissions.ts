export class AllBoardsPermissions {
  create: boolean; // When any board is created by someone else
  update: boolean; // When any board is updated by someone else
  insertMe: boolean; // When I'm inserted into a board by someone else
  removeMe: boolean; // When I'm removed from a board by someone else
}
