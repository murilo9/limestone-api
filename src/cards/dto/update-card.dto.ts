import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CardPriorities } from '../../boards/types/card-priorities';

export class UpdateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsOptional()
  @IsString()
  assignee: string;
  @IsIn(CardPriorities)
  priority: number;
  @IsString()
  @IsNotEmpty()
  columnId: string;
}
