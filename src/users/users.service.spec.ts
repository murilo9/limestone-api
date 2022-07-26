import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { DatabaseServiceMock } from '../database/database.service.mock';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DatabaseService, useValue: new DatabaseServiceMock() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
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

    it('should sign up', async () => {
      signUpForm = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        emailAgain: 'john.doe@email.com',
        password: 'John#123',
        passwordAgain: 'John#123',
      };
      const expectedResult = 'Account created successfully.';
      const result = await service.signUp(signUpForm);
      expect(result).toBe(expectedResult);
    });
  });

  describe('method: verify', () => {
    it('should verify', async () => {
      const result = await service.verify('verifyId');
      const expectedResult = 'Account verified successfully';
      expect(result).toBe(expectedResult);
    });
  });
});
