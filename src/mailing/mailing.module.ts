import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailingService } from './mailing.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
