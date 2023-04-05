import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CreateUserOnSignUpDto } from './dto/create-user-on-signup.dto';
import { SignUpDto } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { IdentityGuard } from '../auth/identity.guard';
import { CreateUserGuard } from './guards/create-user.guard';
import { CreateMemberUserGuard } from './guards/create-member-user.guard';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { ObjectId } from 'mongodb';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserGuard } from './guards/update-user.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/password-recover/:email')
  passwordRecover(@Param('email') email: string) {
    return this.usersService.passwordRecover(email);
  }

  @UseGuards(CreateUserGuard)
  @Post('/signup')
  signUp(@Body(new ValidationPipe(SignUpDto)) signUpDto: SignUpDto) {
    return this.usersService.create(signUpDto);
  }

  @UseGuards(IdentityGuard)
  @Get('/me')
  fetchMe(@Req() request: { user: User }) {
    const { user } = request;
    return user;
  }

  @Post('/verify/:id')
  verify(@Param('id') id: string) {
    return this.usersService.verify(id);
  }

  @UseGuards(IdentityGuard)
  @Get('/users')
  getAll(@Req() request: { user: User }) {
    const { user } = request;
    const adminId = user.createdBy || user._id;
    return this.usersService.getAll(adminId.toString());
  }

  @UseGuards(IdentityGuard, CreateUserGuard, CreateMemberUserGuard)
  @Post('/users')
  createMember(
    @Body(new ValidationPipe(CreateUserDto))
    createUserDto: CreateUserDto,
    @Req() request: { adminId?: ObjectId },
  ) {
    return this.usersService.create(createUserDto, request.adminId);
  }

  @UseGuards(IdentityGuard, UpdateUserGuard)
  @Put('/users/:id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe(UpdateUserDto)) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(IdentityGuard, UpdateUserGuard)
  @Delete('/users/:id')
  remove(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }
}
