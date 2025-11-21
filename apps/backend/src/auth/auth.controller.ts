import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestRegistrationOtpDto } from './dto/request-registration-otp.dto';
import { VerifyRegistrationOtpDto } from './dto/verify-registration-otp.dto';
import { ResendRegistrationOtpDto } from './dto/resend-registration-otp.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-registration-otp')
  requestRegistrationOtp(
    @Body() requestRegistrationOtpDto: RequestRegistrationOtpDto,
  ) {
    return this.authService.requestRegistrationOtp(requestRegistrationOtpDto);
  }

  @Post('verify-registration-otp')
  verifyRegistrationOtp(@Body() verifyDto: VerifyRegistrationOtpDto) {
    return this.authService.verifyRegistrationOtp(verifyDto);
  }

  @Post('resend-registration-otp')
  resendRegistrationOtp(@Body() resendDto: ResendRegistrationOtpDto) {
    return this.authService.resendRegistrationOtp(resendDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
