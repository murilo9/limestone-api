import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';
import { CardCommentsModule } from './card-comments/card-comments.module';
import { ColumnsModule } from './columns/columns.module';
import { ConfigModule } from '@nestjs/config';
import { MailingModule } from './mailing/mailing.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailingModule,
    UsersModule,
    BoardsModule,
    ColumnsModule,
    DatabaseModule,
    AuthModule,
    CardsModule,
    CardCommentsModule,
  ],
})
export class AppModule {}
