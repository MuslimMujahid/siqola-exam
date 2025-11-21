import { IsEmail, IsString } from 'class-validator';

export class RequestRegistrationOtpDto {
  @IsString()
  institutionName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  address: string;

  @IsString()
  phoneNumber: string;
}
