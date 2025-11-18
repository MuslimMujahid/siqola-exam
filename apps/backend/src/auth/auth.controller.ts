import { Controller, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterInstitutionDto } from './dto/register-institution.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-institution')
  registerInstitution(@Body() registerInstitutionDto: RegisterInstitutionDto) {
    return this.authService.registerInstitution(registerInstitutionDto);
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
