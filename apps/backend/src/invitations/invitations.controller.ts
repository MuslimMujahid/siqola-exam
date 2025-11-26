import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InviteUserDto } from './dto/invite-user.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/client';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('invite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EXAMINER)
  @HttpCode(HttpStatus.CREATED)
  async inviteUser(
    @Body() inviteUserDto: InviteUserDto,
    @Headers('x-institution-id') institutionId: string,
  ) {
    return this.invitationsService.inviteUser(inviteUserDto, institutionId);
  }

  @Get(':token')
  async getInvitationDetails(@Param('token') token: string) {
    return this.invitationsService.getInvitationDetails(token);
  }

  @Post(':token/accept')
  @HttpCode(HttpStatus.OK)
  async acceptInvitation(
    @Param('token') token: string,
    @Body() acceptInvitationDto?: AcceptInvitationDto,
  ) {
    return this.invitationsService.acceptInvitation(token, acceptInvitationDto);
  }

  @Post(':token/reject')
  @HttpCode(HttpStatus.OK)
  async rejectInvitation(@Param('token') token: string) {
    return this.invitationsService.rejectInvitation(token);
  }
}
