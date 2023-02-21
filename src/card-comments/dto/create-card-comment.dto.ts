import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateCardCommentDto {
  @Expose()
  @IsString()
  body: string;
}
