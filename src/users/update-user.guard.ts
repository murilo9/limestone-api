import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DatabaseService } from 'src/database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './types/user-role';

/**
 * Checks if user is either updating itself or a member of them.
 */
export class UpdateUserGuard implements CanActivate {
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
    // Verifies if user is updating itself
    const userIsUpdatingSelf = user._id.toString() === params.id;
    let adminUserIsUpdatingMember = false;
    // Verifies if admin user is updating its member
    if (user.role === UserRole.ADMIN) {
      const adminMembers = await this.databaseService.findMany('users', {
        createdBy: new ObjectId(user._id),
      });
      const updatingUserBelongsToAdmin = adminMembers.find(
        (member) => member._id.toString() === params.id,
      );
      adminUserIsUpdatingMember = !!updatingUserBelongsToAdmin;
    }
    if (!userIsUpdatingSelf && !adminUserIsUpdatingMember) {
      throw new UnauthorizedException("You don't have permission to do that");
    }
    return true;
  }
}
