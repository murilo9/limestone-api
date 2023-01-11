import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BoardColumn } from '../entities/board-column.entity';
import { BoardSettings } from '../types/BoardSettings';

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
  settings: BoardSettings;
}
