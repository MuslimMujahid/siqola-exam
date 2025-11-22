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
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddGroupMemberDto } from './dto/add-group-member.dto';
import { AddBatchGroupMembersDto } from './dto/add-batch-group-members.dto';
import { RemoveBatchGroupMembersDto } from './dto/remove-batch-group-members.dto';
import { QueryGroupsDto } from './dto/query-groups.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll(@Query() queryGroupsDto: QueryGroupsDto) {
    return this.groupsService.findAll(
      queryGroupsDto.page,
      queryGroupsDto.limit,
      queryGroupsDto.institutionId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }

  @Post(':id/members')
  addMember(
    @Param('id') id: string,
    @Body() addGroupMemberDto: AddGroupMemberDto,
  ) {
    return this.groupsService.addMember(id, addGroupMemberDto);
  }

  @Post(':id/members/batch')
  addBatchMembers(
    @Param('id') id: string,
    @Body() addBatchGroupMembersDto: AddBatchGroupMembersDto,
  ) {
    return this.groupsService.addBatchMembers(id, addBatchGroupMembersDto);
  }

  @Delete(':id/members/batch')
  @HttpCode(HttpStatus.OK)
  removeBatchMembers(
    @Param('id') id: string,
    @Body() removeBatchGroupMembersDto: RemoveBatchGroupMembersDto,
  ) {
    return this.groupsService.removeBatchMembers(
      id,
      removeBatchGroupMembersDto,
    );
  }

  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.groupsService.removeMember(id, userId);
  }
}
