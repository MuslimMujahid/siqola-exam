import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum QuestionTypeDto {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  ESSAY = 'ESSAY',
  SHORT_ANSWER = 'SHORT_ANSWER',
}

export class QuestionDto {
  @IsEnum(QuestionTypeDto)
  type: QuestionTypeDto;

  @IsString()
  content: any; // JSON content from Slate

  @IsOptional()
  options?: any; // JSON array for multiple choice

  @IsOptional()
  correctAnswer?: any; // JSON for correct answers

  @IsNumber()
  @Min(0)
  points: number;

  @IsInt()
  @Min(0)
  order: number;
}

export class CreateExamDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsInt()
  @Min(1)
  duration: number; // Duration in minutes

  @IsNumber()
  @Min(0)
  @Max(100)
  passingGrade: number;

  @IsBoolean()
  @IsOptional()
  shuffleOptions?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxAttempts?: number;

  @IsString()
  institutionId: string;

  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @IsOptional()
  @IsDateString()
  availableUntil?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @IsOptional()
  questions?: QuestionDto[];
}
