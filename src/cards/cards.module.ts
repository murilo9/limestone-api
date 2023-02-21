import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { CardCommentsModule } from '../card-comments/card-comments.module';

@Module({
  imports: [DatabaseModule, ConfigModule, CardCommentsModule],
  exports: [CardsService],
  providers: [CardsService],
  controllers: [CardsController],
})
export class CardsModule {}
