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
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { QueryExamsDto } from './dto/query-exams.dto';
import { AssignExamDto } from './dto/assign-exam.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { GradeAnswerDto } from './dto/grade-answer.dto';
import { BulkOperationsDto } from './dto/bulk-operations.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/client';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    userId: string;
    role: Role;
  };
}

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.EXAMINER)
  create(
    @Body() createExamDto: CreateExamDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.examsService.create(createExamDto, req.user.userId);
  }

  @Get('tags')
  @Roles(Role.ADMIN, Role.EXAMINER)
  getTags(@Request() req: AuthenticatedRequest) {
    return this.examsService.getTags(req.user.userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EXAMINER)
  findAll(
    @Query() queryExamsDto: QueryExamsDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.examsService.findAll(
      queryExamsDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.EXAMINER)
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.examsService.findOne(id, req.user.userId, req.user.role);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.EXAMINER)
  update(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.examsService.update(
      id,
      updateExamDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.EXAMINER)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.examsService.remove(id, req.user.userId, req.user.role);
  }

  @Post('bulk-operations')
  @Roles(Role.ADMIN, Role.EXAMINER)
  bulkOperations(
    @Body() bulkOperationsDto: BulkOperationsDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.examsService.bulkOperations(
      bulkOperationsDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Post(':id/assign')
  @Roles(Role.ADMIN, Role.EXAMINER)
  assignExam(
    @Param('id') id: string,
    @Body() assignExamDto: AssignExamDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.examsService.assignExam(
      id,
      assignExamDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Get(':id/examinees')
  @Roles(Role.ADMIN, Role.EXAMINER)
  getExamExaminees(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.examsService.getAssignedExaminees(
      id,
      req.user.userId,
      req.user.role,
    );
  }

  @Delete(':id/assignments/:assignmentId')
  @Roles(Role.ADMIN, Role.EXAMINER)
  @HttpCode(HttpStatus.NO_CONTENT)
  revokeAssignment(
    @Param('id') id: string,
    @Param('assignmentId') assignmentId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.examsService.revokeAssignment(
      id,
      assignmentId,
      req.user.userId,
      req.user.role,
    );
  }

  @Post(':id/start')
  @Roles(Role.EXAMINEE)
  startAttempt(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.examsService.startAttempt(id, req.user.userId);
  }

  @Post('attempts/:attemptId/submit')
  @Roles(Role.EXAMINEE)
  submitAnswers(
    @Param('attemptId') attemptId: string,
    @Body() submitAnswerDto: SubmitAnswerDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.examsService.submitAnswers(
      attemptId,
      submitAnswerDto,
      req.user.userId,
    );
  }

  @Get('attempts/:attemptId')
  getAttempt(
    @Param('attemptId') attemptId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.examsService.getAttempt(
      attemptId,
      req.user.userId,
      req.user.role,
    );
  }

  @Post('attempts/:attemptId/answers/:questionId/grade')
  @Roles(Role.ADMIN, Role.EXAMINER)
  gradeAnswer(
    @Param('attemptId') attemptId: string,
    @Param('questionId') questionId: string,
    @Body() gradeAnswerDto: GradeAnswerDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.examsService.gradeAnswer(
      attemptId,
      questionId,
      gradeAnswerDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Get(':id/analytics')
  @Roles(Role.ADMIN, Role.EXAMINER)
  getAnalytics(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.examsService.getExamAnalytics(
      id,
      req.user.userId,
      req.user.role,
    );
  }
}
