import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  EXAMINER = 'EXAMINER',
  EXAMINEE = 'EXAMINEE',
}

export class CreateMembershipDto {
  @IsString()
  userId: string;

  @IsString()
  institutionId: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsString()
  studentId?: string;
}
