import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Observable } from 'rxjs';
import { DatabaseService } from '../../database/database.service';
import { CreateUserOnSignUpDto } from '../dto/create-user-on-signup.dto';
import { SignUpDto } from '../dto/signup.dto';
import { User } from '../entities/user.entity';

/**
 * Ataches admin user ID in the request body, so it could be atached to member's data next.
 */
export class CreateMemberUserGuard implements CanActivate {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      body: CreateUserOnSignUpDto;
      user: User;
      adminId?: ObjectId;
    }>();
    const { user } = request;
    if (!user?._id) {
      throw new BadRequestException('Could not get admin data.');
    }
    request.adminId = user._id;
    return true;
  }
}
