import { IsEmail, IsEnum } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;
}
