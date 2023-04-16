import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
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
import { PasswordRecoveryRequest } from './entities/password-recovery-request';
import { PasswordRecoveryRequestDto } from './dto/password-recovery-request.dto';
import { MailingService } from '../mailing/mailing.service';
import { WelcomeEmailTemplate } from '../mailing/templates/welcome';
import { SignProvider } from './types/sign-provider';

export class UsersService {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
    @Inject(MailingService) private mailingService: MailingService,
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
    signProvider: SignProvider,
    adminId?: ObjectId,
  ) {
    const NODE_ENV = this.configService.get('NODE_ENV');
    const { email, firstName, lastName } = createUserDto;
    let { password } = createUserDto as CreateUserOnSignUpDto;
    let createdByAdmin = false;
    if (!password) {
      createdByAdmin = true;
      password = Math.random().toString(36).slice(-8);
    }
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
      signProvider,
    };
    const createdUser = await this.databaseService.insertOne('users', newUser);

    const hash =
      NODE_ENV === 'test' ? 'some-hash' : await bcrypt.hash(password, 10);

    const userPassword: Omit<UserPassword, '_id' | 'created' | 'updated'> = {
      user: createdUser._id,
      hash,
    };
    await this.databaseService.insertOne('passwords', userPassword);

    const welcomeMail = new WelcomeEmailTemplate(
      createdUser.email,
      createdUser.firstName,
      createdUser.verifyId,
      createdByAdmin ? password : null,
    );
    await this.mailingService.sendMail(welcomeMail);

    return createdUser;
  }

  async verify(verifyId: string) {
    const userToVerify = await this.databaseService.findOne<User>('users', {
      verifyId,
      active: true,
    });
    if (userToVerify) {
      const { _id } = userToVerify;
      userToVerify.verified = true;
      userToVerify.verifyId = '';
      await this.databaseService.updateOne('users', userToVerify, { _id });
      return `<h5>Hi, ${userToVerify.firstName}.</h5><p>Your account has been verified successfully.</p>`;
    } else {
      throw new NotFoundException();
    }
  }

  async getAll(adminId: string) {
    const adminUsers = await this.databaseService.findMany<User>('users', {
      createdBy: new ObjectId(adminId),
      active: true,
    });
    const adminUser = await this.databaseService.findOne<User>('users', {
      _id: new ObjectId(adminId),
      active: true,
    });
    return [...adminUsers, adminUser];
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.databaseService.findOne<User>('users', {
      _id: new ObjectId(id),
      active: true,
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
      active: true,
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

  async passwordRecover(email: string) {
    const accountExists = await this.databaseService.findOne<User>('users', {
      email,
      active: true,
    });
    if (accountExists) {
      let recoveryRequest =
        await this.databaseService.findOne<PasswordRecoveryRequest>(
          'password-recovery-requests',
          { email },
        );
      if (!recoveryRequest) {
        recoveryRequest =
          await this.databaseService.insertOne<PasswordRecoveryRequestDto>(
            'password-recovery-requests',
            { email },
          );
      }
      // TODO: send recover email
    }
  }

  async passwordChange(userId: string, newPassword: string) {
    const NODE_ENV = this.configService.get('NODE_ENV');
    const hash =
      NODE_ENV === 'test' ? 'some-hash' : await bcrypt.hash(newPassword, 10);
    await this.databaseService.updateOne(
      'passwords',
      { hash },
      {
        user: new ObjectId(userId),
      },
    );
  }

  async testMail() {
    this.mailingService.sendMail({
      to: 'murilohenriquematias@gmail.com',
      subject: 'Greetings from Limestone!',
      text: 'Hello! We have noted you joined the platform recently. Welcome!',
    });
  }
}
