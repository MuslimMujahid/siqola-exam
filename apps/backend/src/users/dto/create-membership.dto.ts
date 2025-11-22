import { IsString, IsOptional } from 'class-validator';

export class CreateMembershipDto {
  @IsString()
  userId: string;

  @IsString()
  institutionId: string;

  @IsOptional()
  @IsString()
  studentId?: string;
}
