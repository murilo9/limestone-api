import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MailingModule } from '../mailing/mailing.module';
import { MailingService } from '../mailing/mailing.service';

@Module({
  imports: [DatabaseModule, MailingModule, ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, MailingService],
})
export class UsersModule {}
