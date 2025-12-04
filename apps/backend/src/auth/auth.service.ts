import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

import { RequestRegistrationOtpDto } from './dto/request-registration-otp.dto';
import { VerifyRegistrationOtpDto } from './dto/verify-registration-otp.dto';
import { ResendRegistrationOtpDto } from './dto/resend-registration-otp.dto';
import { Role } from 'generated/prisma/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async requestRegistrationOtp(requestDto: RequestRegistrationOtpDto) {
    const { email, password, institutionName, address, phoneNumber } =
      requestDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Invalidate existing pending registrations for this email
    await this.prisma.pendingRegistration.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // OTP valid for 15 minutes

    const pending = await this.prisma.pendingRegistration.create({
      data: {
        email,
        hashedPassword,
        fullName: institutionName,
        institutionName,
        address,
        phoneNumber,
        otp,
        expiresAt,
      },
    });

    // TODO: send OTP to email via email provider

    return {
      message: 'OTP sent to email',
      email: pending.email,
      expiresAt: pending.expiresAt,
    };
  }

  async verifyRegistrationOtp(verifyDto: VerifyRegistrationOtpDto) {
    const { email, otp } = verifyDto;

    const pending = await this.prisma.pendingRegistration.findFirst({
      where: { email, otp },
    });

    if (!pending) {
      throw new ConflictException('Invalid OTP or email');
    }

    if (pending.used) {
      throw new ConflictException('OTP already used');
    }

    if (new Date() > pending.expiresAt) {
      throw new ConflictException('OTP has expired');
    }

    // Create institution, user, membership in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const institution = await tx.institution.create({
        data: {
          name: pending.institutionName,
          address: pending.address,
        },
      });

      const user = await tx.user.create({
        data: {
          email: pending.email,
          password: pending.hashedPassword,
          fullName: pending.fullName || pending.institutionName,
          phoneNumber: pending.phoneNumber,
          role: Role.ADMIN,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          phoneNumber: true,
          role: true,
          createdAt: true,
        },
      });

      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          institutionId: institution.id,
        },
        include: {
          institution: true,
        },
      });

      await tx.pendingRegistration.update({
        where: { id: pending.id },
        data: { used: true },
      });

      return {
        user: {
          ...user,
          memberships: [membership],
        },
      };
    });

    // Generate JWT token for auto-login
    const token = this.jwtService.sign({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
    });

    return {
      ...result,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            institution: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    // Check if user has a password (not invited user without account)
    if (!user.password) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    // Update lastLogin timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        fullName: userWithoutPassword.fullName,
        role: userWithoutPassword.role,
        createdAt: userWithoutPassword.createdAt,
        updatedAt: userWithoutPassword.updatedAt,
        lastLogin: userWithoutPassword.lastLogin,
        memberships: userWithoutPassword.memberships.map((m) => ({
          status: m.status,
          institution: {
            id: m.institution.id,
            name: m.institution.name,
            logo: m.institution.logo,
          },
        })),
      },
      token,
    };
  }

  async resendRegistrationOtp(resendDto: ResendRegistrationOtpDto) {
    const { email } = resendDto;

    // Find the most recent unused pending registration
    const pending = await this.prisma.pendingRegistration.findFirst({
      where: { email, used: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!pending) {
      throw new NotFoundException(
        'No pending registration found for this email',
      );
    }

    // Invalidate the old pending registration
    await this.prisma.pendingRegistration.update({
      where: { id: pending.id },
      data: { used: true },
    });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Create new pending registration
    const newPending = await this.prisma.pendingRegistration.create({
      data: {
        email: pending.email,
        hashedPassword: pending.hashedPassword,
        fullName: pending.fullName,
        institutionName: pending.institutionName,
        address: pending.address,
        phoneNumber: pending.phoneNumber,
        otp,
        expiresAt,
      },
    });

    // TODO: send new OTP to email via email provider

    return {
      message: 'New OTP sent to email',
      email: newPending.email,
      expiresAt: newPending.expiresAt,
    };
  }
}
