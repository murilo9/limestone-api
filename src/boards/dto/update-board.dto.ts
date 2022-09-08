import { IsArray, IsString } from 'class-validator';

export class UpdateBoardDto {
  @IsString()
  title: string;
  @IsArray()
  @IsString({ each: true })
  users: string[];
}
