import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class GoogleSignDto {
  @Expose()
  @IsString()
  googleAccessToken: string;
}
