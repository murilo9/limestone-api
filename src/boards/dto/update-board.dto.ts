import { IsArray, IsString, ValidateNested } from 'class-validator';
import { BoardColumn } from '../entities/board-column.entity';
import { BoardPermissions } from '../types/board-permissions';

export class UpdateBoardDto {
  title: string;
  @ValidateNested()
  // Which users (IDs) can do what on this board
  permissions: BoardPermissions;
  @ValidateNested()
  columns: BoardColumn[];
  @IsArray()
  @IsString({ each: true })
  users: string[];
}
