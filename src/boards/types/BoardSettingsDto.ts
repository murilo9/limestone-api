import { IsArray, IsDefined, IsString } from 'class-validator';

export class BoardSettingsDto {
  @IsArray()
  @IsDefined()
  @IsString({ each: true })
  canCreateCards: string[];
  @IsArray()
  @IsDefined()
  @IsString({ each: true })
  canCommentOnCards: string[];
}
