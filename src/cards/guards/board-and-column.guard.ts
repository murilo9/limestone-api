import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BoardColumn } from 'src/boards/entities/board-column.entity';
import { Board } from 'src/boards/entities/board.entity';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/users/entities/user.entity';

/**
 * Blocks if:
 * - Either board or column don't exist
 * - Board does not beong to user or user's admin
 */
export class BoardAndColumnGuard implements CanActivate {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: User;
      params: {
        boardId: string;
        columnId: string;
      };
    }>();
    const { user, params } = request;
    const { boardId, columnId } = params;
    // Verifies if board exist
    const board = await this.databaseService.findOne<Board>('boards', {
      _id: new ObjectId(boardId),
    });
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    // Verifies if column exist
    const column = board.columns.find(
      (column) => column._id.toString() === columnId,
    );
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    // Verifies if board belongs to user or user's admin
    const boardBelongsToUser = board.admin.toString() === user._id.toString();
    const boardBelongsToUsersAdmin =
      board.admin.toString() === user.createdBy?.toString();
    if (!boardBelongsToUser && !boardBelongsToUsersAdmin) {
      throw new UnauthorizedException('You lack permission to do that');
    }
    return true;
  }
}
