import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateCardCommentDto {
  @Expose()
  @IsString()
  body: string;
}
