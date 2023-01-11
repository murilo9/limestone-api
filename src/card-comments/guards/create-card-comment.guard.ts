import {
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Board } from '../../boards/entities/board.entity';
import { CardComment } from '../../boards/entities/card-comment.entity';
import { Card } from '../../cards/entities/card.entity';
import { DatabaseService } from '../../database/database.service';
import { User } from '../../users/entities/user.entity';

/**
 * Blocks if:
 * - User is neither admin or in canCommentOnCards array
 */
export class CreateCardCommentGuard implements CanActivate {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: User;
      params: {
        boardId: string;
        cardCommentId: string;
      };
    }>();
    const { params, user } = request;
    const { boardId } = params;
    const board = await this.databaseService.findOne<Board>('boards', {
      _id: new ObjectId(boardId),
    });
    // Verifies if user is author or admin
    const userCanCommentOnCards = board.settings.canCommentOnCards;
    const userIsAdmin = user.createdBy === null;
    if (!userCanCommentOnCards && !userIsAdmin) {
      throw new UnauthorizedException('You lack permission to do that');
    }
    return true;
  }
}
