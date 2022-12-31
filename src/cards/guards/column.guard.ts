import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BoardColumn } from '../../boards/entities/board-column.entity';
import { Board } from '../../boards/entities/board.entity';
import { DatabaseService } from '../../database/database.service';
import { User } from '../../users/entities/user.entity';

/**
 * Blocks if:
 * - Column don't exist
 */
export class ColumnGuard implements CanActivate {
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
    const { params } = request;
    const { boardId, columnId } = params;
    const board = await this.databaseService.findOne<Board>('boards', {
      _id: new ObjectId(boardId),
    });
    // Verifies if column exist
    const column = board.columns.find(
      (column) => column._id.toString() === columnId,
    );
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    return true;
  }
}
