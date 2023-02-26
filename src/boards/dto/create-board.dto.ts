import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { BoardSettingsDto } from '../types/BoardSettingsDto';

export class CreateBoardDto {
  @Expose()
  @IsString()
  title: string;
  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  users: string[];
  @Expose()
  @IsArray()
  @IsString({ each: true })
  columns: string[];
  @Expose()
  @IsDefined()
  @ValidateNested()
  settings: BoardSettingsDto;
}
