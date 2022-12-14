import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';
import { CardCommentsModule } from './card-comments/card-comments.module';

@Module({
  imports: [
    UsersModule,
    BoardsModule,
    DatabaseModule,
    AuthModule,
    CardsModule,
    CardCommentsModule,
  ],
})
export class AppModule {}
