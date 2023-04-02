import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { DatabaseService } from '../database/database.service';
import { SignInDto } from './dto/signin.dto';
import { verify } from 'jsonwebtoken';

export class IdentityGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      body: SignInDto;
      user?: User;
      headers: { access_token: string };
    }>();
    const { access_token } = request.headers;
    try {
      const user = verify(access_token, 'SECRET') as User;
      request.user = user;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Could not validate access_token.');
    }
  }
}
