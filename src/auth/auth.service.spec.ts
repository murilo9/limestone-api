import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { DatabaseServiceMock } from '../database/database.service.mock';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/types/user-role';
import jwt = require('jsonwebtoken');
import { ObjectId, WithId } from 'mongodb';
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let databaseService: DatabaseService;
  const JWT_SECRET = 'secret';

  beforeEach(async () => {
    const databaseServiceMock = new DatabaseServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AuthService, useValue: new AuthService(JWT_SECRET) },
        { provide: DatabaseService, useValue: databaseServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should sign JWT with user data', async () => {
    // Arrange
    const user = {
      email: 'john.doe@email.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.admin,
      createdBy: '',
      verified: true,
      verifyId: '',
      active: false,
      notificationOptions: {
        allBoards: {
          onCreate: true,
          onUpdate: true,
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
      _id: {} as ObjectId,
      created: undefined,
      updated: undefined,
    } as WithId<User>;
    jest.spyOn(databaseService, 'findOne').mockImplementation(async () => user);
    const sign = jest.spyOn(jwt, 'sign');
    // Act
    await authService.signIn(user);
    // Assert
    expect(sign).toBeCalledWith(user, JWT_SECRET);
  });
});
