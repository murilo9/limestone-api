import {
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Card } from '../../cards/entities/card.entity';
import { DatabaseService } from '../../database/database.service';
import { User } from '../../users/entities/user.entity';
import { CardComment } from '../entities/card-comment.entity';

/**
 * Blocks if:
 * - Comment does not exist
 * - User is neither author or admin
 */
export class CardCommentGuard implements CanActivate {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: User;
      params: {
        cardId: string;
        cardCommentId: string;
      };
    }>();
    const { params, user } = request;
    const { cardCommentId } = params;
    // Verifies if card comment exists
    const cardComment = await this.databaseService.findOne<CardComment>(
      'cardComments',
      { _id: new ObjectId(cardCommentId) },
    );
    if (!cardComment) {
      throw new NotFoundException('Comment not found');
    }
    // Verifies if user is author or admin
    const userIsAuthor = cardComment.author.toString() === user._id.toString();
    const userIsAdmin = user.createdBy === null;
    if (!userIsAuthor && !userIsAdmin) {
      throw new UnauthorizedException('You lack permission to do that');
    }
    return true;
  }
}
