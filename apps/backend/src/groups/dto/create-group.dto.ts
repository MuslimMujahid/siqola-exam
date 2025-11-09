import { IsString, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  institutionId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
