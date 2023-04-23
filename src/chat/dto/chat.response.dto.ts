import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class ChatResponseDto {
  @IsNumber()
  stage?: number;

  @IsBoolean()
  isFinished: boolean;

  @IsString()
  data: string;
}
