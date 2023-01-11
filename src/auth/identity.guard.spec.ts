import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { IdentityGuard } from './identity.guard';
import { verify, sign } from 'jsonwebtoken';
import { createMock } from '@golevelup/ts-jest';
import { User } from '../users/entities/user.entity';
import { ObjectId } from 'mongodb';

describe('IdentityGuard', () => {
  let identityGuard: IdentityGuard;
  let mockExecutionContext: ExecutionContext;
  let user: User;
  let request: {
    headers: {
      access_token: string;
    };
    user?: User;
  };
  let access_token: string;
  const JWT_SECRET = 'secret';

  beforeEach(() => {
    identityGuard = new IdentityGuard();
    user = {
      email: '',
      firstName: '',
      lastName: '',
      createdBy: null,
      verified: false,
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
      _id: new ObjectId('some-user-id'),
      created: new Date(),
      updated: new Date(),
    };
  });

  it('should return true when user exists on token', async () => {
    // Arrange
    access_token = sign(user, JWT_SECRET);
    request = {
      headers: {
        access_token,
      },
    };
    mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    });
    // Act
    const result = await identityGuard.canActivate(mockExecutionContext);
    // Assert
    expect(result).toBeTruthy();
  });

  it('should throw when access_token is invalid', async () => {
    // Arrange
    access_token = 'some-invalid-token';
    request = {
      headers: {
        access_token,
      },
    };
    mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    });
    const expectedError = new UnauthorizedException(
      'Could not validate access_token.',
    );
    // Act
    const result = async () =>
      await identityGuard.canActivate(mockExecutionContext);
    // Assert
    expect(result).rejects.toThrow(expectedError);
  });

  it('should throw when access_token is not sent', async () => {
    // Arrange
    request = {
      headers: {} as { access_token: string },
    };
    mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    });
    const expectedError = new UnauthorizedException(
      'Could not validate access_token.',
    );
    // Act
    const result = async () =>
      await identityGuard.canActivate(mockExecutionContext);
    // Assert
    expect(result).rejects.toThrow(expectedError);
  });
});
