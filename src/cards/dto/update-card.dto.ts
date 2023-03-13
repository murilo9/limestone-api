import { Expose } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CardPriorities } from '../types/card-priorities';

export class UpdateCardDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  index: number;
  @Expose()
  @IsString()
  @IsOptional()
  description: string;
  @Expose()
  @IsOptional()
  @IsString()
  assignee: string;
  @Expose()
  @IsIn(CardPriorities)
  priority: number;
  @Expose()
  @IsString()
  @IsNotEmpty()
  columnId: string;
}
