import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateColumnDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  index: number;
}
