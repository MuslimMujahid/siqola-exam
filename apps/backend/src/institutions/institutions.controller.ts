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
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { InstitutionStatsDto } from './dto/institution-stats.dto';

@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Post()
  create(@Body() createInstitutionDto: CreateInstitutionDto) {
    return this.institutionsService.create(createInstitutionDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.institutionsService.findAll(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.institutionsService.findOne(id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string): Promise<InstitutionStatsDto> {
    return this.institutionsService.getStats(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ) {
    return this.institutionsService.update(id, updateInstitutionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.institutionsService.remove(id);
  }
}
