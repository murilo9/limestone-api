import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, ConfigModule],
  providers: [CardsService],
  controllers: [CardsController],
})
export class CardsModule {}
