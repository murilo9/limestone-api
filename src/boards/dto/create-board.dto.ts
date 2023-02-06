import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { BoardSettingsDto } from '../types/BoardSettingsDto';

export class CreateBoardDto {
  @IsString()
  title: string;
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  users: string[];
  @IsArray()
  @IsString({ each: true })
  columns: string[];
  @ValidateNested({ each: true })
  @Type(() => BoardSettingsDto)
  settings: BoardSettingsDto;
}
