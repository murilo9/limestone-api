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

export class BoardPermissionsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      body: SignInDto;
      user: User;
      params: {
        boardId: string;
      };
    }>();
    const { user } = request;
    const { boardId } = request.params;
    return true;
  }
}
