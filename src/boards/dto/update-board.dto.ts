import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BoardSettingsDto } from '../types/BoardSettingsDto';

export class UpdateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  owner: string;
  @IsArray()
  @IsString({ each: true })
  users: string[];
  @IsBoolean()
  archived: boolean;
  @ValidateNested()
  settings: BoardSettingsDto;
}
