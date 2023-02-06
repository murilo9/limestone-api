import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Board } from '../../boards/entities/board.entity';
import { DatabaseService } from '../../database/database.service';
import { User } from '../../users/entities/user.entity';

/**
 * Blocks if:
 * - Board does not exist
 * - Board does not belong to user or user's admin
 */
export class BoardGuard implements CanActivate {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: User;
      params: {
        boardId: string;
      };
    }>();
    const { user, params } = request;
    const { boardId } = params;
    // Verifies if board exist
    const board = await this.databaseService.findOne<Board>('boards', {
      _id: new ObjectId(boardId),
    });
    if (!board) {
      throw new NotFoundException('Board not found');
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
