import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignUpDto } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { IdentityGuard } from 'src/auth/identity.guard';
import { CreateUserGuard } from './create-user.guard';
import { CreateMemberUserGuard } from './create-member-user.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(CreateUserGuard)
  @Post('/signup')
  signUp(@Body(new ValidationPipe()) signUpDto: SignUpDto) {
    return this.usersService.create(signUpDto);
  }

  @Post('/verify/:id')
  verify(@Param('id') id: string) {
    return this.usersService.verify(id);
  }

  @UseGuards(IdentityGuard)
  @Get('/users')
  getAll() {
    return this.usersService.getAll();
  }

  @UseGuards(IdentityGuard, CreateUserGuard, CreateMemberUserGuard)
  @Post('/users')
  createMember(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, true);
  }

  @Put('/users')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('/users/:id')
  remove(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }
}
