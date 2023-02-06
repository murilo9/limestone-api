import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateColumnDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsNumber()
  @IsNotEmpty()
  index: number;
}
