import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CardPriorities } from '../../boards/types/card-priorities';

export class CreateCardDto {
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
}
