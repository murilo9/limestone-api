import {
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../../database/database.service';
import { User } from '../../users/entities/user.entity';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { Board } from '../entities/board.entity';

/**
 * Blocks if:
 * - Board does not exist
 * - User has no permission to update the board
 * - New owner does not exist, if changing owner
 */
export class UpdateBoardGuard implements CanActivate {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: User;
      params: {
        id: string;
      };
      body: UpdateBoardDto;
    }>();
    const { user, params, body } = request;
    // Verifies if board exists
    const boardId = params.id;
    const boardToUpdate = await this.databaseService.findOne<Board>('boards', {
      _id: new ObjectId(boardId),
    });
    if (!boardToUpdate) {
      throw new NotFoundException('Board not found');
    }
    // Verifies if board is being updated by its owner, or by the admin
    const userId = user._id.toString();
    const boardIsBeingUpdatedByOwner =
      boardToUpdate.owner.toString() === userId;
    const boardIsBeingUpdatedByAdmin =
      boardToUpdate.admin.toString() === userId;
    if (!boardIsBeingUpdatedByAdmin && !boardIsBeingUpdatedByOwner) {
      throw new UnauthorizedException('You do not have permission to do that');
    }
    // If changing board owner, verifies if owner exists
    const newOwnerId = body.owner;
    const adminId = user.createdBy?.toString() || user._id.toString();
    if (newOwnerId !== boardToUpdate.owner.toString()) {
      const newOwner = await this.databaseService.findOne<User>('users', {
        _id: new ObjectId(newOwnerId),
      });
      if (!newOwner) {
        throw new NotFoundException('Owner does not exist');
      }
      // Verifies if new owner either belongs to the same admin or IS admin
      const newOwnerBelongsToSameAdmin =
        newOwner.createdBy?.toString() === adminId;
      const newOwnerIsAdmin = newOwner._id.toString() === adminId;
      if (!newOwnerBelongsToSameAdmin && !newOwnerIsAdmin) {
        throw new NotFoundException('Owner does not exist');
      }
    }
    return true;
  }
}
