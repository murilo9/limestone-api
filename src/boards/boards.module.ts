import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { ColumnsModule } from '../columns/columns.module';

@Module({
  imports: [DatabaseModule, ConfigModule, ColumnsModule],
  exports: [BoardsService],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
