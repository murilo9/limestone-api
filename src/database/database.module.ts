import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  providers: [
    {
      provide: DatabaseService,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const MONGODB_URI =
          configService.get('MONGODB_URI') + '?connectTimeoutMS=4000';
        const client = new MongoClient(MONGODB_URI);
        try {
          console.log('connecting to database...');
          await client.connect();
          console.log('connected');
        } catch (error) {
          console.log(error);
        }
        return new DatabaseService(client);
      },
    },
  ],
  exports: [DatabaseService, ConfigModule],
})
export class DatabaseModule {}
