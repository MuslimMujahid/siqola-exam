import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  EXAMINER = 'EXAMINER',
  EXAMINEE = 'EXAMINEE',
}

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  studentId?: string;

  @IsString()
  institutionId: string;

  @IsEnum(Role)
  role: Role;
}
