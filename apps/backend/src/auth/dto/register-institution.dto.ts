import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterInstitutionDto {
  @IsString()
  @MinLength(2)
  institutionName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  address: string;

  @IsString()
  phoneNumber: string;
}
