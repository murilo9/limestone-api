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

/**
 * Blocks if:
 * - Card does not exist
 */
export class CardExistsGuard implements CanActivate {
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
    const { params } = request;
    const { cardId } = params;
    // Verifies if card exists
    const card = await this.databaseService.findOne<Card>('cards', {
      _id: new ObjectId(cardId),
    });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return true;
  }
}
