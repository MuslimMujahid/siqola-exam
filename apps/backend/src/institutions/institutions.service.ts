import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInstitutionDto: CreateInstitutionDto) {
    return this.prisma.institution.create({
      data: createInstitutionDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [institutions, total] = await Promise.all([
      this.prisma.institution.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              memberships: true,
              groups: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.institution.count(),
    ]);

    return {
      data: institutions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
          },
        },
        groups: true,
        _count: {
          select: {
            memberships: true,
            groups: true,
          },
        },
      },
    });

    if (!institution) {
      throw new NotFoundException(`Institution with ID ${id} not found`);
    }

    return institution;
  }

  async update(id: string, updateInstitutionDto: UpdateInstitutionDto) {
    await this.findOne(id);

    return this.prisma.institution.update({
      where: { id },
      data: updateInstitutionDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.institution.delete({
      where: { id },
    });
  }
}
