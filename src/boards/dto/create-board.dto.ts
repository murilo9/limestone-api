import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  title: string;
  @IsUUID()
  admin: string;
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  users: string[];
}
