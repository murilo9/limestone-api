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
        { provide: DatabaseService, useValue: new DatabaseServiceMock() },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  describe('method: signUp', () => {
    let signUpForm = {
      firstName: '',
      lastName: '',
      email: '',
      emailAgain: '',
      password: '',
      passwordAgain: '',
    };

    beforeEach(() => {
      signUpForm = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        emailAgain: 'john.doe@email.com',
        password: 'John#123',
        passwordAgain: 'John#123',
      };
    });

    it('should return the expected result', async () => {
      // Arrange
      const expectedResult = 'Account created successfully.';
      // Act
      const result = await usersService.signUp(signUpForm);
      // Assert
      expect(result).toBe(expectedResult);
    });

    it('should call database insertOne method passing the user', async () => {
      // Arrange
      const customId = 'custom-id';
      const insertOne = jest.spyOn(databaseService, 'insertOne');
      const { email, firstName, lastName } = signUpForm;
      const expectedUser = {
        email,
        firstName,
        lastName,
        role: UserRole.superadmin,
        verified: false,
        verifyId: customId,
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
      // Act
      await usersService.signUp(signUpForm, customId);
      // Assert
      expect(insertOne).toBeCalledWith('users', expectedUser);
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
