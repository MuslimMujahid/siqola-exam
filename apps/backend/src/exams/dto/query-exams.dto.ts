import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsInt,
  IsArray,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum ExamStatusFilter {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

export class QueryExamsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  institutionId?: string;

  @IsOptional()
  @IsEnum(ExamStatusFilter)
  status?: ExamStatusFilter;

  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @IsOptional()
  @IsDateString()
  createdUntil?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
