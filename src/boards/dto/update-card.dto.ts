import { IsIn, IsString } from 'class-validator';
import { CardPriorities } from '../types/card-priorities';

export class UpdateCardDTO {
  @IsString()
  title: string;
  @IsString()
  assignee: string;
  @IsIn(CardPriorities)
  priority: number;
}
