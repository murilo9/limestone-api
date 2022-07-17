import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  signUp(signUpDto: SignUpDto) {
    return 'This action signs up a new user';
  }

  signIn(signInDto: SignInDto) {
    return 'This action signs in a user';
  }

  verify(verifyId: string) {
    return 'This action verifies a user account';
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
