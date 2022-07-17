import { IsIn, IsString } from 'class-validator';
import { CardPriorities } from '../types/CardPriorities';

export class CreateCardDTO {
  @IsString()
  title: string;
  @IsString()
  assignee: string;
  @IsIn(CardPriorities)
  priority: number;
}
