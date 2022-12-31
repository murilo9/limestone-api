import {
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Card } from '../../cards/entities/card.entity';
import { DatabaseService } from '../../database/database.service';
import { User } from '../../users/entities/user.entity';

/**
 * Blocks if:
 * - Card does not exist
 */
export class CardGuard implements CanActivate {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: User;
      params: {
        cardId: string;
      };
    }>();
    const { params } = request;
    const { cardId } = params;
    const card = await this.databaseService.findOne<Card>('cards', {
      _id: new ObjectId(cardId),
    });
    // Verifies if card exists
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return true;
  }
}
