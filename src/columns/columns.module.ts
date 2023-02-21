import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [DatabaseModule, ConfigModule, CardsModule],
  exports: [ColumnsService],
  providers: [ColumnsService],
  controllers: [ColumnsController],
})
export class ColumnsModule {}
