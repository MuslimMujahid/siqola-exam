import { IsString, IsOptional } from 'class-validator';

export class CreateInstitutionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  logo?: string;
}
