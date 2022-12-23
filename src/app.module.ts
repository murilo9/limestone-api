import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [UsersModule, BoardsModule, DatabaseModule, AuthModule, CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
