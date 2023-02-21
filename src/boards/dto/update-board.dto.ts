import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BoardSettingsDto } from '../types/BoardSettingsDto';

export class UpdateBoardDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  owner: string;
  @Expose()
  @IsArray()
  @IsString({ each: true })
  users: string[];
  @Expose()
  @IsBoolean()
  archived: boolean;
  @Expose()
  @ValidateNested()
  settings: BoardSettingsDto;
}
