import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CardPriorities } from '../types/card-priorities';

export class UpdateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsOptional()
  @IsString()
  assignee: string;
  @IsIn(CardPriorities)
  priority: number;
  @IsString()
  @IsNotEmpty()
  columnId: string;
}
