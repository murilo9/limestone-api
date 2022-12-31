import { IsString } from 'class-validator';

export class UpdateCardCommentDto {
  @IsString()
  body: string;
}
