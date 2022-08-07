import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [{ provide: AuthService, useValue: new AuthService('secret') }],
  controllers: [AuthController],
})
export class AuthModule {}
