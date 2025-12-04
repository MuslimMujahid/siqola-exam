import { Controller, Post, Body, Res } from '@nestjs/common';
import * as express from 'express';
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
  async verifyRegistrationOtp(
    @Body() verifyDto: VerifyRegistrationOtpDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.verifyRegistrationOtp(verifyDto);

    // Set httpOnly cookie with the token
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data without token
    const { token: _, ...data } = result;
    return data;
  }

  @Post('resend-registration-otp')
  resendRegistrationOtp(@Body() resendDto: ResendRegistrationOtpDto) {
    return this.authService.resendRegistrationOtp(resendDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Set httpOnly cookie with the token
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data without token
    const { token: _, ...data } = result;
    return data;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('token');
    return { message: 'Logged out successfully' };
  }
}
