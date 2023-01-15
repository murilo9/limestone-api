import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BoardSettingsDto } from '../types/BoardSettingsDto';

class ColumnDto {
  @IsString()
  @IsNotEmpty()
  _id: string;
  @IsString()
  @IsNotEmpty()
  title: string;
}
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
  @IsArray()
  @ValidateNested()
  @Type(() => ColumnDto)
  columns: ColumnDto[];
  @ValidateNested()
  settings: BoardSettingsDto;
}
