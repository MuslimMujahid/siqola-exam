import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipStatusDto } from './dto/update-membership-status.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EXAMINER)
  findAll(@Query() filterUsersDto: FilterUsersDto) {
    return this.usersService.findAll(filterUsersDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.EXAMINER)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('memberships')
  @Roles(Role.ADMIN)
  createMembership(@Body() createMembershipDto: CreateMembershipDto) {
    return this.usersService.createMembership(createMembershipDto);
  }

  @Patch(':userId/institutions/:institutionId/status')
  @Roles(Role.ADMIN)
  updateMembershipStatus(
    @Param('userId') userId: string,
    @Param('institutionId') institutionId: string,
    @Body() updateMembershipStatusDto: UpdateMembershipStatusDto,
  ) {
    return this.usersService.updateMembershipStatus(
      userId,
      institutionId,
      updateMembershipStatusDto,
    );
  }

  @Delete(':userId/institutions/:institutionId')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMembership(
    @Param('userId') userId: string,
    @Param('institutionId') institutionId: string,
  ) {
    return this.usersService.removeMembership(userId, institutionId);
  }
}
