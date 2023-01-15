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
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignUpDto } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { IdentityGuard } from '../auth/identity.guard';
import { CreateUserGuard } from './create-user.guard';
import { CreateMemberUserGuard } from './create-member-user.guard';
import { UpdateUserGuard } from './update-user.guard';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { ObjectId } from 'mongodb';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(CreateUserGuard)
  @Post('/signup')
  signUp(@Body(new ValidationPipe()) signUpDto: SignUpDto) {
    return this.usersService.create(signUpDto);
  }

  @UseGuards(IdentityGuard)
  @Get('/me')
  fetchMe(@Req() request: { user: User }) {
    const { user } = request;
    console.log('user', user);
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
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Req() request: { adminId?: ObjectId },
  ) {
    return this.usersService.create(createUserDto, request.adminId);
  }

  @UseGuards(IdentityGuard, UpdateUserGuard)
  @Put('/users/:id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(IdentityGuard, UpdateUserGuard)
  @Delete('/users/:id')
  remove(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }
}
