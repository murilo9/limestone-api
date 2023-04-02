import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import axios, { Axios } from 'axios';
import { DatabaseService } from '../database/database.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [
    AuthService,
    UsersService,
    {
      provide: Axios,
      useValue: axios,
    },
    {
      provide: 'JWT_SECRET',
      useValue: 'SECRET',
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
