import { IsEnum, IsString, IsOptional, IsNumber } from 'class-validator';

enum UserStatus {
  Pending = 'pending',
  Done = 'done',
}

enum UserGender {
  Male = 'male',
  Female = 'female',
  None = 'none',
}

enum UserMBTI {
  ISTJ = 'ISTJ',
  ISFJ = 'ISFJ',
  INFJ = 'INFJ',
  INTJ = 'INTJ',
  ISTP = 'ISTP',
  ISFP = 'ISFP',
  INFP = 'INFP',
  INTP = 'INTP',
  ESTP = 'ESTP',
  ESFP = 'ESFP',
  ENFP = 'ENFP',
  ENTP = 'ENTP',
  ESTJ = 'ESTJ',
  ESFJ = 'ESFJ',
  ENFJ = 'ENFJ',
  ENTJ = 'ENTJ',
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  birthday?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: string;

  @IsOptional()
  @IsEnum(UserMBTI)
  mbti?: string;

  @IsOptional()
  @IsEnum(UserGender)
  gender?: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsNumber()
  grade?: number;
}
