import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddGroupMemberDto } from './dto/add-group-member.dto';
import { AddBatchGroupMembersDto } from './dto/add-batch-group-members.dto';
import { RemoveBatchGroupMembersDto } from './dto/remove-batch-group-members.dto';

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

    const { memberIds, ...groupData } = createGroupDto;

    // Create group with members in a transaction
    return this.prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: groupData,
        include: {
          institution: true,
          _count: {
            select: {
              groupMembers: true,
            },
          },
        },
      });

      // Add members if provided
      if (memberIds && memberIds.length > 0) {
        // Verify all users exist
        const users = await tx.user.findMany({
          where: { id: { in: memberIds } },
          select: { id: true },
        });

        const existingUserIds = new Set(users.map((u) => u.id));
        const validMemberIds = memberIds.filter((id) =>
          existingUserIds.has(id),
        );

        // Create group members
        if (validMemberIds.length > 0) {
          await tx.groupMember.createMany({
            data: validMemberIds.map((userId) => ({
              groupId: group.id,
              userId,
            })),
            skipDuplicates: true,
          });
        }
      }

      // Return group with updated count
      return tx.group.findUnique({
        where: { id: group.id },
        include: {
          institution: true,
          _count: {
            select: {
              groupMembers: true,
            },
          },
        },
      });
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

  async addBatchMembers(
    groupId: string,
    addBatchGroupMembersDto: AddBatchGroupMembersDto,
  ) {
    // Verify group exists
    await this.findOne(groupId);

    const results: Array<{
      userId: string;
      success: boolean;
      error?: string;
    }> = [];
    let successCount = 0;
    let failedCount = 0;

    for (const userId of addBatchGroupMembersDto.userIds) {
      try {
        // Check if user exists
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          results.push({
            userId,
            success: false,
            error: `User with ID ${userId} not found`,
          });
          failedCount++;
          continue;
        }

        // Check if member already exists
        const existingMember = await this.prisma.groupMember.findUnique({
          where: {
            groupId_userId: {
              groupId,
              userId,
            },
          },
        });

        if (existingMember) {
          results.push({
            userId,
            success: false,
            error: 'User is already a member of this group',
          });
          failedCount++;
          continue;
        }

        // Add member
        await this.prisma.groupMember.create({
          data: {
            groupId,
            userId,
          },
        });

        results.push({
          userId,
          success: true,
        });
        successCount++;
      } catch (error) {
        results.push({
          userId,
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to add member',
        });
        failedCount++;
      }
    }

    return {
      success: successCount,
      failed: failedCount,
      results,
    };
  }

  async removeBatchMembers(
    groupId: string,
    removeBatchGroupMembersDto: RemoveBatchGroupMembersDto,
  ) {
    // Verify group exists
    await this.findOne(groupId);

    const results: Array<{
      userId: string;
      success: boolean;
      error?: string;
    }> = [];
    let successCount = 0;
    let failedCount = 0;

    for (const userId of removeBatchGroupMembersDto.userIds) {
      try {
        // Check if member exists
        const groupMember = await this.prisma.groupMember.findUnique({
          where: {
            groupId_userId: {
              groupId,
              userId,
            },
          },
        });

        if (!groupMember) {
          results.push({
            userId,
            success: false,
            error: 'Group member not found',
          });
          failedCount++;
          continue;
        }

        // Remove member
        await this.prisma.groupMember.delete({
          where: {
            groupId_userId: {
              groupId,
              userId,
            },
          },
        });

        results.push({
          userId,
          success: true,
        });
        successCount++;
      } catch (error) {
        results.push({
          userId,
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to remove member',
        });
        failedCount++;
      }
    }

    return {
      success: successCount,
      failed: failedCount,
      results,
    };
  }
}
