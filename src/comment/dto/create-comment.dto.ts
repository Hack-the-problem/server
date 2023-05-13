import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  nickname: string;

  @IsString()
  resultId: string;

  @IsString()
  text: string;
}
