import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CardPriorities } from '../types/card-priorities';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsNumber()
  @IsNotEmpty()
  index: number;
  @IsString()
  @IsOptional()
  description: string;
  @IsOptional()
  @IsString()
  assignee: string;
  @IsIn(CardPriorities)
  priority: number;
}
