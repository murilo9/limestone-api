import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Column } from '../../columns/entities/column.entity';
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
    const { columnId } = params;
    // Verifies if column exist
    const column = await this.databaseService.findOne<Column>('columns', {
      _id: new ObjectId(columnId),
    });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    return true;
  }
}
