import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    const jwtSecret =
      configService.get<string>('JWT_ACCESS_SECRET') || 'your-secret-key';

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Extract token from httpOnly cookie
          const token = request?.cookies?.token as string | undefined;
          return token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        memberships: {
          include: {
            institution: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return user object that will be attached to request.user
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      memberships: user.memberships,
    };
  }
}
