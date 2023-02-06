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
 * - User is not admin or is not at board's canCreateCards array
 */
export class CreateCardGuard implements CanActivate {
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
    const { params, user } = request;
    const { boardId } = params;
    const board = await this.databaseService.findOne<Board>('boards', {
      _id: new ObjectId(boardId),
    });
    // Verifies if user is admin
    const userIsAdmin = user.createdBy === null;
    // Verifies if user can create cards in this board
    const userCanCreateComments = board.settings.canCreateCards.find(
      (allowedUser) => user._id.toString() === allowedUser.toString(),
    );
    if (!userIsAdmin && !userCanCreateComments) {
      throw new UnauthorizedException('You lack permission to do that');
    }
    return true;
  }
}
