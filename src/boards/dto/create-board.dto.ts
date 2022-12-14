import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { BoardColumn } from '../entities/board-column.entity';

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
}
