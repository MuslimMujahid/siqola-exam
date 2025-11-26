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
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { InstitutionStatsDto } from './dto/institution-stats.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/client';

@Controller('institutions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createInstitutionDto: CreateInstitutionDto) {
    return this.institutionsService.create(createInstitutionDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EXAMINER)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.institutionsService.findAll(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.EXAMINER)
  findOne(@Param('id') id: string) {
    return this.institutionsService.findOne(id);
  }

  @Get(':id/stats')
  @Roles(Role.ADMIN, Role.EXAMINER)
  getStats(@Param('id') id: string): Promise<InstitutionStatsDto> {
    return this.institutionsService.getStats(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ) {
    return this.institutionsService.update(id, updateInstitutionDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.institutionsService.remove(id);
  }
}
