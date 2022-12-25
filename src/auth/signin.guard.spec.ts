import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { DatabaseServiceMock } from '../database/database.service.mock';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInGuard } from './signin.guard';
import bcrypt = require('bcrypt');
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('SignInGuard', () => {
  let signInGuard: SignInGuard;
  let databaseService: DatabaseServiceMock;
  let request: {
    body: {
      email: string;
      password: string;
    };
  };
  let mockExecutionContext: ExecutionContext;
  const mockFindOne =
    (data: { [key: string]: any }) =>
    async (collection: string, filter: { [key: string]: any }) =>
      data[collection];

  beforeEach(() => {
    databaseService = new DatabaseServiceMock();
    signInGuard = new SignInGuard(
      databaseService as unknown as DatabaseService,
    );
    request = {
      body: {
        email: 'john.doe@email.com',
        password: 'Johndoe#123',
      },
    };
    mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should return true when account exists and password match', async () => {
    // Arrange
    const data = {
      users: {
        _id: {
          toString: () => 'john-doe-id',
        },
        email: 'john.doe@email.com',
      },
      passwords: {
        user: 'john-doe-id',
        hash: 'john-doe-password-hash',
      },
    };
    jest
      .spyOn(databaseService, 'findOne')
      .mockImplementation(mockFindOne(data));
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
    // Act
    const result = await signInGuard.canActivate(mockExecutionContext);
    // Assert
    expect(result).toBeTruthy();
  });

  it('should add user data on request when authentication passes', async () => {
    // Arrange
    const data = {
      users: {
        _id: {
          toString: () => 'john-doe-id',
        },
        email: 'john.doe@email.com',
      },
      passwords: {
        user: 'john-doe-id',
        hash: 'john-doe-password-hash',
      },
    };
    const expectedUser = data.users;
    jest
      .spyOn(databaseService, 'findOne')
      .mockImplementation(mockFindOne(data));
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
    // Act
    const request = mockExecutionContext.switchToHttp().getRequest();
    await signInGuard.canActivate(mockExecutionContext);
    // Assert
    expect(request.user).toEqual(expectedUser);
  });

  it('should throw when password does no match', async () => {
    // Arrange
    const expectedError = new UnauthorizedException(
      'Wrong e-mail or password.',
    );
    const data = {
      users: {
        _id: {
          toString: () => 'john-doe-id',
        },
        email: 'john.doe@email.com',
      },
      passwords: {
        user: 'john-doe-id',
        hash: 'john-doe-password-hash',
      },
    };
    jest
      .spyOn(databaseService, 'findOne')
      .mockImplementation(mockFindOne(data));
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => false); // <- Password will never match here
    // Act
    const result = async () =>
      await signInGuard.canActivate(mockExecutionContext);
    // Assert
    expect(result).rejects.toThrow(expectedError);
  });

  it('should throw when user account is not found', async () => {
    // Arrange
    const expectedError = new UnauthorizedException(
      'Wrong e-mail or password.',
    );
    const data = {
      users: null, // <- No accounts will be found on DB
      passwords: {
        user: 'john-doe-id',
        hash: 'john-doe-password-hash',
      },
    };
    jest
      .spyOn(databaseService, 'findOne')
      .mockImplementation(mockFindOne(data));
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
    // Act
    const result = async () =>
      await signInGuard.canActivate(mockExecutionContext);
    // Assert
    expect(result).rejects.toThrow(expectedError);
  });
});
