import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterInstitutionDto } from './dto/register-institution.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registerInstitution(registerInstitutionDto: RegisterInstitutionDto) {
    const { email, password, institutionName, address, phoneNumber } =
      registerInstitutionDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create institution, user, membership, and email verification token in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create institution
      const institution = await tx.institution.create({
        data: {
          name: institutionName,
          address,
        },
      });

      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName: institutionName,
          phoneNumber,
          emailVerified: false,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          phoneNumber: true,
          createdAt: true,
        },
      });

      // Create membership
      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          institutionId: institution.id,
          role: 'ADMIN',
        },
        include: {
          institution: true,
        },
      });

      // Create email verification token
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

      const verificationToken = await tx.emailVerificationToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      return {
        institution,
        user,
        membership,
        verificationToken: {
          token: verificationToken.token,
          expiresAt: verificationToken.expiresAt,
        },
      };
    });

    return result;
  }

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, institutionId, role, studentId, ...userData } =
      registerUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if institution exists
    const institution = await this.prisma.institution.findUnique({
      where: { id: institutionId },
    });

    if (!institution) {
      throw new ConflictException(
        `Institution with ID ${institutionId} not found`,
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user, membership, and email verification token in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          ...userData,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          createdAt: true,
        },
      });

      // Create membership
      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          institutionId,
          role,
          studentId,
        },
        include: {
          institution: true,
        },
      });

      // Create email verification token
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

      const verificationToken = await tx.emailVerificationToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      return {
        user,
        membership,
        verificationToken: {
          token: verificationToken.token,
          expiresAt: verificationToken.expiresAt,
        },
      };
    });

    return result;
  }

  async verifyEmail(token: string) {
    const verificationToken =
      await this.prisma.emailVerificationToken.findUnique({
        where: { token },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
      });

    if (!verificationToken) {
      throw new ConflictException('Invalid verification token');
    }

    if (verificationToken.used) {
      throw new ConflictException('Verification token has already been used');
    }

    if (new Date() > verificationToken.expiresAt) {
      throw new ConflictException('Verification token has expired');
    }

    // Mark token as used and set user's emailVerified to true in a transaction
    await this.prisma.$transaction(async (tx) => {
      // Mark token as used
      await tx.emailVerificationToken.update({
        where: { token },
        data: { used: true },
      });

      // Update user's emailVerified status
      await tx.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true },
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      });
    });

    return {
      message: 'Email verified successfully',
      user: verificationToken.user,
    };
  }
}
