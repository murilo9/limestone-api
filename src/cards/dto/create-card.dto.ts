import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CardPriorities } from 'src/boards/types/card-priorities';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsOptional()
  @IsString()
  assignee: string;
  @IsIn(CardPriorities)
  priority: number;
}
