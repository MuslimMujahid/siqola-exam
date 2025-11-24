import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipStatusDto } from './dto/update-membership-status.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import * as bcrypt from 'bcrypt';
import { UserWhereInput } from 'generated/prisma/models';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(filterUsersDto: FilterUsersDto) {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      status,
      institutionId,
      groupId,
      excludeGroupId,
    } = filterUsersDto;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: UserWhereInput = {};

    // Search by name or email
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by role on user
    if (role?.length) {
      where.role = { in: role };
    }

    // Filter by status or institution on membership (arrays)
    if (status?.length || institutionId?.length) {
      where.memberships = {
        some: {
          ...(status?.length && { status: { in: status } }),
          ...(institutionId?.length && {
            institutionId: { in: institutionId },
          }),
        },
      };
    }

    // Filter by group - users must be in at least one of the specified groups
    if (groupId?.length) {
      where.groupMembers = {
        some: { groupId: { in: groupId } },
      };
    }

    // Exclude users already in any of the specified groups
    if (excludeGroupId?.length) {
      where.groupMembers = {
        none: { groupId: { in: excludeGroupId } },
      };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          memberships: {
            include: {
              institution: true,
            },
          },
          groupMembers: {
            include: {
              group: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        memberships: {
          include: {
            institution: true,
          },
        },
        groupMembers: {
          include: {
            group: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });
  }

  async createMembership(createMembershipDto: CreateMembershipDto) {
    const { userId, institutionId } = createMembershipDto;

    // Check if user exists
    await this.findOne(userId);

    // Check if institution exists
    const institution = await this.prisma.institution.findUnique({
      where: { id: institutionId },
    });

    if (!institution) {
      throw new NotFoundException(
        `Institution with ID ${institutionId} not found`,
      );
    }

    // Check if membership already exists
    const existingMembership = await this.prisma.membership.findUnique({
      where: {
        userId_institutionId: {
          userId,
          institutionId,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException('Membership already exists');
    }

    return this.prisma.membership.create({
      data: createMembershipDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        institution: true,
      },
    });
  }

  async updateMembershipStatus(
    userId: string,
    institutionId: string,
    updateMembershipStatusDto: UpdateMembershipStatusDto,
  ) {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_institutionId: {
          userId,
          institutionId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return this.prisma.membership.update({
      where: {
        userId_institutionId: {
          userId,
          institutionId,
        },
      },
      data: {
        status: updateMembershipStatusDto.status,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        institution: true,
      },
    });
  }

  async removeMembership(userId: string, institutionId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_institutionId: {
          userId,
          institutionId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return this.prisma.membership.delete({
      where: {
        userId_institutionId: {
          userId,
          institutionId,
        },
      },
    });
  }
}
