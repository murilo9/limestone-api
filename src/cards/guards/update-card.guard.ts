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
import { UpdateCardDto } from '../dto/update-card.dto';

/**
 * Blocks if:
 * - Card does not exist
 * - Card assignee either does not exist or does not belong to user's admin
 * - Card column does not exist
 * Also assigns ObjectId to foreign keys
 */
export class UpdateCardGuard implements CanActivate {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      params: {
        cardId: string;
        boardId: string;
        columnId: string;
      };
      body: UpdateCardDto;
      user: User;
    }>();
    const { params, body, user } = request;
    const { cardId, boardId, columnId } = params;
    // Verifies if card exists
    const card = this.databaseService.findOne('cards', {
      _id: new ObjectId(cardId),
    });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    // Verifies if card assignee exists
    let assigneeExists = true;
    let assigneeBelongsToUsersAdmin = true;
    if (body.assignee) {
      const cardAssignee = await this.databaseService.findOne<User>('users', {
        _id: new ObjectId(body.assignee),
      });
      assigneeExists = !!cardAssignee;
      assigneeBelongsToUsersAdmin =
        cardAssignee.createdBy === user.createdBy ||
        cardAssignee.createdBy === user._id;
    }
    if (!assigneeExists) {
      throw new BadRequestException('Assignee not found');
    }
    if (!assigneeBelongsToUsersAdmin) {
      throw new UnauthorizedException(
        'You cannot assign that person to this card',
      );
    }
    // Verifies if card column exist
    let cardColumnExists = true;
    if (body.columnId) {
      const board = await this.databaseService.findOne<Board>('boards', {
        _id: new ObjectId(boardId),
      });
      const cardColumn = board.columns.find(
        (column) => column._id.toString() === columnId,
      );
      cardColumnExists = !!cardColumn;
    }
    if (!cardColumnExists) {
      throw new BadRequestException('Column not found');
    }
    return true;
  }
}
