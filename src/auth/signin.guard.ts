import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DatabaseService } from '../database/database.service';
import { SignInDto } from './dto/signin.dto';
import bcrypt = require('bcrypt');
import { UserPassword } from '../users/entities/user-password.entity';
import { User } from '../users/entities/user.entity';

export class SignInGuard implements CanActivate {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ body: SignInDto; user?: User }>();
    const { email, password } = request.body;
    const user = await this.databaseService.findOne<User>('users', {
      email,
      active: true,
    });
    if (!user) {
      throw new UnauthorizedException('Wrong e-mail or password.');
    }
    const userPassword = await this.databaseService.findOne<UserPassword>(
      'passwords',
      {
        user: user._id,
      },
    );
    if (!userPassword) {
      throw new UnauthorizedException('Wrong e-mail or password.');
    }
    const match = await bcrypt.compare(password, userPassword.hash);
    if (!match) {
      throw new UnauthorizedException('Wrong e-mail or password.');
    }
    request.user = user;
    return true;
  }
}
