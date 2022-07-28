import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './types/user-role';
import { v4 as uuid } from 'uuid';
import { UserNotificationOptions } from './types/user-notification-options';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async signUp(signUpDto: SignUpDto, customId?: string) {
    const { email, firstName, lastName } = signUpDto;
    // TODO: check if email is already registered

    const newUser: Omit<User, '_id' | 'created' | 'updated'> = {
      email,
      firstName,
      lastName,
      role: UserRole.superadmin,
      verified: false,
      verifyId: customId || uuid(),
      active: true,
      boardsPermissions: {
        create: true,
        update: true,
        delete: true,
      },
      notificationOptions: {
        allBoards: {
          create: true,
          update: true,
          insertMe: true,
          removeMe: true,
        },
        myCards: {
          create: true,
          update: true,
          delete: true,
        },
        myBoardCards: {
          create: true,
          update: true,
          delete: true,
        },
      },
    };
    await this.databaseService.insertOne('users', newUser);

    // TODO: send verification email

    return 'Account created successfully.';
  }

  signIn(signInDto: SignInDto) {
    return 'This action signs in a user';
  }

  async verify(verifyId: string) {
    const userToVerify = await this.databaseService.findOne<User>('users', {
      verifyId,
    });
    if (userToVerify) {
      const { _id } = userToVerify;
      userToVerify.verified = true;
      userToVerify.verifyId = '';
      await this.databaseService.updateOne('users', userToVerify, { _id });
      return 'Account verified successfully';
    } else {
      throw new NotFoundException();
    }
  }

  getAll() {
    return `This action returns all users from the superadmin`;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action creates a member/admin user';
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return 'This action updates a user';
  }

  deactivate(id: string) {
    return `This action deactivates a user`;
  }
}
