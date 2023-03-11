import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DatabaseService } from '../../database/database.service';
import { SignUpDto } from '../dto/signup.dto';

/**
 * Verifies is user's e-mail is already registered.
 */
export class CreateUserGuard implements CanActivate {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      body: SignUpDto;
    }>();
    const { email } = request.body;
    const emailRegistered = await this.databaseService.findOne('users', {
      email,
    });
    if (emailRegistered) {
      throw new BadRequestException('E-amil address already registered.');
    }
    return true;
  }
}
