import {
  CanActivate,
  Inject,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { PasswordChangeDto } from '../dto/password-change.dto';
import { UserPassword } from '../entities/user-password.entity';
import { User } from '../entities/user.entity';
import bcrypt = require('bcrypt');

/**
 *
 */
export class PasswordChangeGuard implements CanActivate {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ body: PasswordChangeDto; user: User }>();
    const { currentPassword } = request.body;
    const { user } = request;
    const userPassword = await this.databaseService.findOne<UserPassword>(
      'passwords',
      {
        user: user._id,
      },
    );
    if (!userPassword) {
      throw new NotFoundException('Could not find user.');
    }
    const match = await bcrypt.compare(currentPassword, userPassword.hash);
    if (!match) {
      throw new UnauthorizedException('Wrong password.');
    }
    return true;
  }
}
