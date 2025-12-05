import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateIf,
} from 'class-validator';

export class AssignExamDto {
  @ValidateIf((o: AssignExamDto) => !o.groupIds || o.groupIds.length === 0)
  @IsArray()
  @IsString({ each: true })
  userIds?: string[];

  @ValidateIf((o: AssignExamDto) => !o.userIds || o.userIds.length === 0)
  @IsArray()
  @IsString({ each: true })
  groupIds?: string[];

  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @IsOptional()
  @IsDateString()
  availableUntil?: string;
}
