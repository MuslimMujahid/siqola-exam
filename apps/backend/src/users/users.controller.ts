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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipStatusDto } from './dto/update-membership-status.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto.page, paginationDto.limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('memberships')
  createMembership(@Body() createMembershipDto: CreateMembershipDto) {
    return this.usersService.createMembership(createMembershipDto);
  }

  @Patch(':userId/institutions/:institutionId/status')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMembership(
    @Param('userId') userId: string,
    @Param('institutionId') institutionId: string,
  ) {
    return this.usersService.removeMembership(userId, institutionId);
  }
}
