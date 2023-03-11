import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateUserOnSignUpDto } from './dto/create-user-on-signup.dto';
import { SignUpDto } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { DatabaseService } from '../database/database.service';
import bcrypt = require('bcrypt');
import { UserPassword } from './entities/user-password.entity';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { CreateUserDto } from './dto/create-user.dto';
import { BoardsService } from '../boards/boards.service';

export class UsersService {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
    private configService: ConfigService,
  ) {}

  /**
   * Creates an admin or member user.
   * @param signUpDto Sign up form
   * @param adminId If present, creates a member user instead of an admin user
   * @returns
   */
  async create(
    createUserDto: CreateUserOnSignUpDto | CreateUserDto,
    adminId?: ObjectId,
  ) {
    const NODE_ENV = this.configService.get('NODE_ENV');
    const { email, firstName, lastName } = createUserDto;
    let password = (createUserDto as CreateUserOnSignUpDto).password;
    // TODO: define a random temporary password, that'll be sent to the user by e-mail
    password = password || 'random-temporary-password';
    const newUser: Omit<User, '_id' | 'created' | 'updated'> = {
      email,
      firstName,
      lastName,
      title: '',
      createdBy: adminId ? new ObjectId(adminId) : null,
      verified: false,
      verifyId: NODE_ENV === 'test' ? 'some-verify-id' : uuid(),
      active: true,
      notificationOptions: {
        allBoards: {
          onCreate: !adminId,
          onUpdate: !adminId,
          onInsertMe: true,
          onRemoveMe: true,
        },
        myCards: {
          onCreate: true,
          onUpdate: true,
          onDelete: true,
        },
        myBoardCards: {
          onCreate: true,
          onUpdate: true,
          onDelete: true,
        },
      },
    };
    const createdUser = await this.databaseService.insertOne('users', newUser);

    const hash =
      NODE_ENV === 'test' ? 'some-hash' : await bcrypt.hash(password, 10);

    const userPassword: Omit<UserPassword, '_id' | 'created' | 'updated'> = {
      user: NODE_ENV === 'test' ? 'some-user-id' : createdUser._id,
      hash,
    };
    await this.databaseService.insertOne('passwords', userPassword);

    // TODO: send verification email

    return createdUser;
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

  async getAll(adminId: string) {
    const adminUsers = await this.databaseService.findMany('users', {
      createdBy: new ObjectId(adminId),
    });
    const adminUser = await this.databaseService.findOne('users', {
      _id: new ObjectId(adminId),
    });
    return [...adminUsers, adminUser];
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.databaseService.findOne<User>('users', {
      _id: new ObjectId(id),
    });
    if (userToUpdate) {
      Object.keys(updateUserDto).forEach((key) => {
        userToUpdate[key] = updateUserDto[key];
      });
      const updateResult = await this.databaseService.updateOne(
        'users',
        userToUpdate,
        {
          _id: new ObjectId(id),
        },
      );
      return updateResult;
    } else {
      throw new NotFoundException();
    }
  }

  async deactivate(id: string) {
    const userToDeactivate = await this.databaseService.findOne<User>('users', {
      _id: new ObjectId(id),
    });
    if (!userToDeactivate) {
      throw new NotFoundException();
    }
    // If user is already deactivated
    if (!userToDeactivate.active) {
      return 'User was deactivated already';
    }
    const deactivatingAdminUser = userToDeactivate.createdBy === null;
    // If deactivating an admin user, deactivate all their members as well
    if (deactivatingAdminUser) {
      await this.databaseService.updateMany<User>(
        'users',
        { active: false },
        {
          createdBy: new ObjectId(id),
        },
      );
    }
    // Finally, deactivate user
    await this.databaseService.updateOne(
      'users',
      { active: false },
      { _id: new ObjectId(id) },
    );
    return `User deactivated successfully`;
  }
}
