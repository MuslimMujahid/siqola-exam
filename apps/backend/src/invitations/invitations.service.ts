import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { InviteUserDto } from './dto/invite-user.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async inviteUser(inviteUserDto: InviteUserDto, institutionId: string) {
    const { email, role } = inviteUserDto;

    // Check if institution exists
    const institution = await this.prisma.institution.findUnique({
      where: { id: institutionId },
    });

    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          where: { institutionId },
        },
      },
    });

    let userId: string | null = null;

    if (existingUser) {
      // Check if user already has membership
      if (existingUser.memberships.length > 0) {
        throw new ConflictException(
          'User already has membership in this institution',
        );
      }

      // Create membership with PENDING status
      await this.prisma.membership.create({
        data: {
          userId: existingUser.id,
          institutionId,
          status: 'PENDING',
        },
      });

      userId = existingUser.id;
    } else {
      // Create user with email only, email_verified = false
      const newUser = await this.prisma.user.create({
        data: {
          fullName: email,
          email,
          role,
          emailVerified: false,
          memberships: {
            create: {
              institutionId,
              status: 'PENDING',
            },
          },
        },
      });

      userId = newUser.id;
    }

    // Create invitation token (expires in 3 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3);

    const invitationToken = await this.prisma.invitationToken.create({
      data: {
        email,
        role,
        userId,
        institutionId,
        expiresAt,
      },
    });

    // Send invitation email
    const invitationUrl = `${process.env.FRONTEND_URL}/invitation/${invitationToken.token}`;

    await this.mailService.sendInvitationEmail({
      to: email,
      institutionName: institution.name,
      role,
      invitationUrl,
      expiresAt,
    });

    return {
      message: 'Invitation sent successfully',
      invitationUrl,
      expiresAt: invitationToken.expiresAt,
    };
  }

  async getInvitationDetails(token: string) {
    const invitation = await this.prisma.invitationToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            emailVerified: true,
            fullName: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.used) {
      throw new BadRequestException('Invitation has already been used');
    }

    if (new Date() > invitation.expiresAt) {
      throw new BadRequestException('Invitation has expired');
    }

    const institution = await this.prisma.institution.findUnique({
      where: { id: invitation.institutionId },
      select: {
        id: true,
        name: true,
        logo: true,
      },
    });

    return {
      email: invitation.email,
      role: invitation.role,
      institution,
      isExistingUser: !!invitation.user?.emailVerified,
      userFullName: invitation.user?.fullName,
    };
  }

  async acceptInvitation(
    token: string,
    acceptInvitationDto?: AcceptInvitationDto,
  ) {
    const invitation = await this.prisma.invitationToken.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.used) {
      throw new BadRequestException('Invitation has already been used');
    }

    if (new Date() > invitation.expiresAt) {
      throw new BadRequestException('Invitation has expired');
    }

    const user = invitation.user;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If user is not verified (new user), require account details
    if (!user.emailVerified) {
      if (!acceptInvitationDto) {
        throw new BadRequestException(
          'Account details are required for new users',
        );
      }

      const hashedPassword = await bcrypt.hash(
        acceptInvitationDto.password,
        10,
      );

      // Update user with account details
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          fullName: acceptInvitationDto.fullName,
          phoneNumber: acceptInvitationDto.phoneNumber,
          password: hashedPassword,
          emailVerified: true,
        },
      });
    }

    // Update membership status to ACTIVE
    await this.prisma.membership.update({
      where: {
        userId_institutionId: {
          userId: user.id,
          institutionId: invitation.institutionId,
        },
      },
      data: {
        status: 'ACTIVE',
      },
    });

    // Mark invitation as used
    await this.prisma.invitationToken.update({
      where: { token },
      data: { used: true },
    });

    return {
      message: 'Invitation accepted successfully',
    };
  }

  async rejectInvitation(token: string) {
    const invitation = await this.prisma.invitationToken.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.used) {
      throw new BadRequestException('Invitation has already been used');
    }

    if (new Date() > invitation.expiresAt) {
      throw new BadRequestException('Invitation has expired');
    }

    const user = invitation.user;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove membership
    await this.prisma.membership.delete({
      where: {
        userId_institutionId: {
          userId: user.id,
          institutionId: invitation.institutionId,
        },
      },
    });

    // If user is not verified (was created just for this invitation), delete user
    if (!user.emailVerified) {
      await this.prisma.user.delete({
        where: { id: user.id },
      });
    }

    // Mark invitation as used
    await this.prisma.invitationToken.update({
      where: { token },
      data: { used: true },
    });

    return {
      message: 'Invitation rejected successfully',
    };
  }
}
