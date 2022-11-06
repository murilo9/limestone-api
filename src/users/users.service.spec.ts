import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { DatabaseServiceMock } from '../database/database.service.mock';
import { UserRole } from './types/user-role';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ConfigService,
        { provide: DatabaseService, useValue: new DatabaseServiceMock() },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('method: create', () => {
    let signUpForm = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };

    beforeEach(async () => {
      signUpForm = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        password: 'John#123',
      };
    });

    it('should return the expected result', async () => {
      // Arrange
      const expectedResult = 'Account created successfully.';
      // Act
      const result = await usersService.create(signUpForm);
      // Assert
      expect(result).toBe(expectedResult);
    });

    it('should insert the user on database', async () => {
      // Arrange
      const insertOne = jest.spyOn(databaseService, 'insertOne');
      const { email, firstName, lastName } = signUpForm;
      const expectedUser = {
        email,
        firstName,
        lastName,
        role: UserRole.ADMIN,
        createdBy: null,
        verified: false,
        verifyId: 'some-verify-id',
        active: true,
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
      };
      // Act
      await usersService.create(signUpForm);
      // Assert
      expect(insertOne).toBeCalledWith('users', expectedUser);
    });

    it('should insert user password on database', async () => {
      // Arrange
      const insertOne = jest.spyOn(databaseService, 'insertOne');
      const expectedPassword = {
        user: 'some-user-id',
        hash: 'some-hash',
      };
      // Act
      await usersService.create(signUpForm);
      // Assert
      expect(insertOne).toBeCalledWith('passwords', expectedPassword);
    });
  });

  describe('method: verify', () => {
    it('should verify', async () => {
      // Arrange
      const expectedResult = 'Account verified successfully';
      // Act
      const result = await usersService.verify('verifyId');
      // Assert
      expect(result).toBe(expectedResult);
    });

    it('should search verified user', async () => {
      // Arrange
      const userToVerify = {
        verifyId: 'some-verify-id',
      };
      const findOne = jest.spyOn(databaseService, 'findOne');
      // Act
      await usersService.verify(userToVerify.verifyId);
      // Assert
      expect(findOne).toBeCalledWith('users', userToVerify);
    });

    it("should set user's verified attribute to true and verifyId to empty string", async () => {
      // Arrange
      const userToVerify = {
        verifyId: 'some-verify-id',
      };
      const updatedUser = {
        verified: true,
        verifyId: '',
      };
      const updateOne = jest.spyOn(databaseService, 'updateOne');
      // Act
      await usersService.verify(userToVerify.verifyId);
      // Assert
      expect(updateOne).toBeCalledWith('users', updatedUser, {
        _id: undefined,
      });
    });
  });
});
