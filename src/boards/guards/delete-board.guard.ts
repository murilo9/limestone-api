import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../../database/database.service';
import { User } from '../../users/entities/user.entity';
import { Board } from '../entities/board.entity';

/**
 * Blocks if:
 * - Board is not archived
 */
export class DeleteBoardGuard implements CanActivate {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: User;
      params: {
        id: string;
      };
    }>();
    const { user, params } = request;
    // Verifies if board is archived
    const boardId = params.id;
    const boardToUpdate = await this.databaseService.findOne<Board>('boards', {
      _id: new ObjectId(boardId),
    });
    if (!boardToUpdate) {
      throw new NotFoundException('Board not found');
    }
    if (!boardToUpdate.archived) {
      throw new BadRequestException('Board is not archived');
    }
    return true;
  }
}
