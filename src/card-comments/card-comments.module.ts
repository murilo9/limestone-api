import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { CardCommentsController } from './card-comments.controller';
import { CardCommentsService } from './card-comments.service';

@Module({
  imports: [DatabaseModule, ConfigModule],
  providers: [CardCommentsService],
  controllers: [CardCommentsController],
})
export class CardCommentsModule {}
