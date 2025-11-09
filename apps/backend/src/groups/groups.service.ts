import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddGroupMemberDto } from './dto/add-group-member.dto';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto) {
    const institution = await this.prisma.institution.findUnique({
      where: { id: createGroupDto.institutionId },
    });

    if (!institution) {
      throw new NotFoundException(
        `Institution with ID ${createGroupDto.institutionId} not found`,
      );
    }

    return this.prisma.group.create({
      data: createGroupDto,
      include: {
        institution: true,
        _count: {
          select: {
            groupMembers: true,
          },
        },
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, institutionId?: string) {
    const skip = (page - 1) * limit;

    const where = institutionId ? { institutionId } : {};

    const [groups, total] = await Promise.all([
      this.prisma.group.findMany({
        where,
        skip,
        take: limit,
        include: {
          institution: true,
          _count: {
            select: {
              groupMembers: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.group.count({ where }),
    ]);

    return {
      data: groups,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        institution: true,
        groupMembers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
                studentId: true,
              },
            },
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    await this.findOne(id);

    return this.prisma.group.update({
      where: { id },
      data: updateGroupDto,
      include: {
        institution: true,
        _count: {
          select: {
            groupMembers: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.group.delete({
      where: { id },
    });
  }

  async addMember(groupId: string, addGroupMemberDto: AddGroupMemberDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: addGroupMemberDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${addGroupMemberDto.userId} not found`,
      );
    }

    const existingMember = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: addGroupMemberDto.userId,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this group');
    }

    return this.prisma.groupMember.create({
      data: {
        groupId,
        userId: addGroupMemberDto.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            studentId: true,
          },
        },
        group: true,
      },
    });
  }

  async removeMember(groupId: string, userId: string) {
    const groupMember = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!groupMember) {
      throw new NotFoundException('Group member not found');
    }

    return this.prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });
  }
}
