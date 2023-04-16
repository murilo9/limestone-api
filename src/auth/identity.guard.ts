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
import { ObjectId } from 'mongodb';

export class IdentityGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      body: SignInDto;
      user?: User;
      headers: { authorization: string };
    }>();
    const { authorization } = request.headers;
    try {
      const user = verify(authorization, 'SECRET') as User;
      // user _id actually comes as string, so it must be converted to ObjectId here
      request.user = {
        ...user,
        _id: new ObjectId(user._id),
      };
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(
        'Could not validate Authorization header.',
      );
    }
  }
}
