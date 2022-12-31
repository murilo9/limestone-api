import { IsString } from 'class-validator';

export class CreateCardCommentDto {
  @IsString()
  body: string;
}
