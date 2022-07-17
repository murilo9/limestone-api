import { IsIn, IsString } from 'class-validator';
import { CardPriorities } from '../types/CardPriorities';

export class UpdateCardDTO {
  @IsString()
  title: string;
  @IsString()
  assignee: string;
  @IsIn(CardPriorities)
  priority: number;
}
