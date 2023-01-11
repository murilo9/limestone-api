import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { DatabaseServiceMock } from '../database/database.service.mock';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let databaseService: DatabaseService;
  let databaseServiceMock: DatabaseServiceMock;

  beforeEach(async () => {
    databaseServiceMock = new DatabaseServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ConfigService,
        { provide: DatabaseService, useValue: databaseServiceMock },
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

    it('should insert the admin user on database', async () => {
      // Arrange
      const insertOne = jest.spyOn(databaseService, 'insertOne');
      const { email, firstName, lastName } = signUpForm;
      const expectedUser = {
        email,
        firstName,
        lastName,
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

    it('should insert the member user on database', async () => {
      // Arrange
      const insertOne = jest.spyOn(databaseService, 'insertOne');
      const { email, firstName, lastName } = signUpForm;
      const adminId = new ObjectId(0);
      const expectedUser = {
        email,
        firstName,
        lastName,
        createdBy: adminId,
        verified: false,
        verifyId: 'some-verify-id',
        active: true,
        notificationOptions: {
          allBoards: {
            onCreate: false,
            onUpdate: false,
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
      await usersService.create(signUpForm, adminId);
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

  describe('method: deactivate', () => {
    let userMock: { _id: ObjectId; active: boolean; createdBy: null };

    describe('context: user is active', () => {
      beforeEach(() => {
        userMock = {
          _id: new ObjectId(),
          active: true,
          createdBy: null,
        };
        jest
          .spyOn(databaseServiceMock, 'findOne')
          .mockImplementation(async () => userMock);
      });

      it('should report propperly', async () => {
        // Arrange
        const expectedResult = 'User deactivated successfully';
        // Act
        const result = await usersService.deactivate(userMock._id.toString());
        // Assert
        expect(result).toBe(expectedResult);
      });

      it('should update user in database', async () => {
        // Arrange
        const updateOne = jest.spyOn(databaseService, 'updateOne');
        // Act
        await usersService.deactivate(userMock._id.toString());
        // Assert
        expect(updateOne).toBeCalledWith(
          'users',
          { active: false },
          { _id: userMock._id },
        );
      });

      it('should deactivate member users when deactivating an admin', async () => {
        // Arrange
        userMock = {
          ...userMock,
        };
        const updateMany = jest.spyOn(databaseService, 'updateMany');
        // Act
        await usersService.deactivate(userMock._id.toString());
        // Assert
        expect(updateMany).toBeCalledWith(
          'users',
          { active: false },
          { createdBy: userMock._id },
        );
      });
    });

    describe('context: user is inactive', () => {
      beforeEach(() => {
        userMock = {
          _id: new ObjectId(),
          active: false,
          createdBy: null,
        };
        jest
          .spyOn(databaseServiceMock, 'findOne')
          .mockImplementation(async () => userMock);
      });

      it('should report propperly', async () => {
        // Arrange
        const expectedResult = 'User was deactivated already';
        // Act
        const result = await usersService.deactivate(userMock._id.toString());
        // Assert
        expect(result).toBe(expectedResult);
      });

      it('should not call updateOne method', async () => {
        // Arrange
        const updateOne = jest.spyOn(databaseService, 'updateOne');
        // Act
        await usersService.deactivate(userMock._id.toString());
        // Assert
        expect(updateOne).toBeCalledTimes(0);
      });

      it('should not call updateMany method', async () => {
        // Arrange
        const updateMany = jest.spyOn(databaseService, 'updateMany');
        // Act
        await usersService.deactivate(userMock._id.toString());
        // Assert
        expect(updateMany).toBeCalledTimes(0);
      });
    });
  });
});
