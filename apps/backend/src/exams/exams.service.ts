import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { QueryExamsDto } from './dto/query-exams.dto';
import { AssignExamDto } from './dto/assign-exam.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { GradeAnswerDto } from './dto/grade-answer.dto';
import {
  BulkOperationsDto,
  BulkOperationType,
} from './dto/bulk-operations.dto';
import { Role, ExamStatus, AttemptStatus } from '../../generated/prisma/client';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTags(userId: string): Promise<
    {
      id: string;
      name: string;
      institutionId: string | null;
      isPublic: boolean;
    }[]
  > {
    // Get user's institution(s)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          select: { institutionId: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const institutionIds = user.memberships.map((m) => m.institutionId);

    if (institutionIds.length === 0) {
      return [];
    }

    // Fetch tags that are either:
    // 1. Public (institutionId is null)
    // 2. Belong to user's institution(s)
    const tags = await this.prisma.tag.findMany({
      where: {
        OR: [
          { institutionId: null }, // Public tags
          { institutionId: { in: institutionIds } }, // Institution-specific tags
        ],
      },
      orderBy: { name: 'asc' },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      institutionId: tag.institutionId,
      isPublic: tag.institutionId === null,
    }));
  }

  async create(createExamDto: CreateExamDto, userId: string) {
    const { questions, ...examData } = createExamDto;

    return this.prisma.$transaction(async (tx) => {
      const exam = await tx.exam.create({
        data: {
          ...examData,
          creatorId: userId,
          status: ExamStatus.DRAFT,
        },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          institution: true,
        },
      });

      // Create questions if provided
      if (questions && questions.length > 0) {
        await tx.question.createMany({
          data: questions.map((q) => ({
            examId: exam.id,
            type: q.type as any,
            content: q.content,
            options: q.options,
            correctAnswer: q.correctAnswer,
            points: q.points,
            order: q.order,
          })),
        });
      }

      return tx.exam.findUnique({
        where: { id: exam.id },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          institution: true,
          questions: {
            orderBy: { order: 'asc' },
          },
          _count: {
            select: {
              assignments: true,
              attempts: true,
            },
          },
        },
      });
    });
  }

  async findAll(queryDto: QueryExamsDto, userId: string, userRole: Role) {
    const {
      page = 1,
      limit = 10,
      institutionId,
      status,
      createdFrom,
      createdUntil,
      search,
      tags,
    } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.ExamWhereInput = {};

    // Admin can see all exams, Examiner can only see their own
    if (userRole !== Role.ADMIN) {
      where.creatorId = userId;
    }

    if (institutionId) {
      where.institutionId = institutionId;
    }

    if (status) {
      where.status = status;
    }

    if (createdFrom || createdUntil) {
      where.createdAt = {};
      if (createdFrom) {
        where.createdAt.gte = new Date(createdFrom);
      }
      if (createdUntil) {
        where.createdAt.lte = new Date(createdUntil);
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags && tags.length > 0) {
      where.examTags = {
        some: {
          tagId: { in: tags },
        },
      };
    }

    const [exams, total] = await Promise.all([
      this.prisma.exam.findMany({
        where,
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          institution: true,
          examTags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              assignments: true,
              attempts: true,
              questions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.exam.count({ where }),
    ]);

    // Transform examTags to tags array
    const transformedExams = exams.map((exam) => ({
      ...exam,
      tags: exam.examTags.map((et) => et.tag),
      examTags: undefined, // Remove examTags from response
    }));

    return {
      data: transformedExams,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string, userRole: Role) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        institution: true,
        examTags: {
          include: {
            tag: true,
          },
        },
        questions: {
          orderBy: { order: 'asc' },
        },
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
            group: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            attempts: true,
          },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    // Check permission
    if (userRole !== Role.ADMIN && exam.creatorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this exam',
      );
    }

    // Transform examTags to tags array
    const transformedExam = {
      ...exam,
      tags: exam.examTags.map((et) => et.tag),
      examTags: undefined,
    };

    return transformedExam;
  }

  async update(
    id: string,
    updateExamDto: UpdateExamDto,
    userId: string,
    userRole: Role,
  ) {
    await this.findOne(id, userId, userRole);

    const { questions, ...examData } = updateExamDto;

    return this.prisma.$transaction(async (tx) => {
      await tx.exam.update({
        where: { id },
        data: examData,
      });

      // Update questions if provided
      if (questions) {
        // Delete existing questions
        await tx.question.deleteMany({
          where: { examId: id },
        });

        // Create new questions
        if (questions.length > 0) {
          await tx.question.createMany({
            data: questions.map((q) => ({
              examId: id,
              type: q.type as any,
              content: q.content,
              options: q.options,
              correctAnswer: q.correctAnswer,
              points: q.points,
              order: q.order,
            })),
          });
        }
      }

      return tx.exam.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          institution: true,
          questions: {
            orderBy: { order: 'asc' },
          },
          _count: {
            select: {
              assignments: true,
              attempts: true,
            },
          },
        },
      });
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    await this.findOne(id, userId, userRole);

    return this.prisma.exam.delete({
      where: { id },
    });
  }

  async assignExam(
    examId: string,
    assignDto: AssignExamDto,
    userId: string,
    userRole: Role,
  ) {
    await this.findOne(examId, userId, userRole);

    const { userIds, groupIds, availableFrom, availableUntil } = assignDto;

    if (
      (!userIds || userIds.length === 0) &&
      (!groupIds || groupIds.length === 0)
    ) {
      throw new BadRequestException(
        'Must provide at least one user or group to assign',
      );
    }

    const assignments: any[] = [];

    // Assign to users
    if (userIds && userIds.length > 0) {
      for (const userId of userIds) {
        assignments.push({
          examId,
          userId,
          availableFrom: availableFrom ? new Date(availableFrom) : null,
          availableUntil: availableUntil ? new Date(availableUntil) : null,
        });
      }
    }

    // Assign to groups
    if (groupIds && groupIds.length > 0) {
      for (const groupId of groupIds) {
        assignments.push({
          examId,
          groupId,
          availableFrom: availableFrom ? new Date(availableFrom) : null,
          availableUntil: availableUntil ? new Date(availableUntil) : null,
        });
      }
    }

    return this.prisma.examAssignment.createMany({
      data: assignments,
      skipDuplicates: true,
    });
  }

  async getAssignedExaminees(
    examId: string,
    userId: string,
    userRole: Role,
  ): Promise<any[]> {
    await this.findOne(examId, userId, userRole);

    const assignments = await this.prisma.examAssignment.findMany({
      where: { examId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        group: {
          include: {
            groupMembers: {
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
          },
        },
      },
    });

    // Flatten group members into individual users
    const examinees: any[] = [];
    const seenUserIds = new Set<string>();

    for (const assignment of assignments) {
      if (assignment.user) {
        if (!seenUserIds.has(assignment.user.id)) {
          const attempts = await this.prisma.examAttempt.findMany({
            where: {
              examId,
              userId: assignment.user.id,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

          examinees.push({
            ...assignment.user,
            assignmentId: assignment.id,
            availableFrom: assignment.availableFrom,
            availableUntil: assignment.availableUntil,
            attempts: attempts.length,
            latestAttempt: attempts[0] || null,
          });
          seenUserIds.add(assignment.user.id);
        }
      }

      if (assignment.group) {
        for (const member of assignment.group.groupMembers) {
          if (!seenUserIds.has(member.user.id)) {
            const attempts = await this.prisma.examAttempt.findMany({
              where: {
                examId,
                userId: member.user.id,
              },
              orderBy: {
                createdAt: 'desc',
              },
            });

            examinees.push({
              ...member.user,
              assignmentId: assignment.id,
              groupId: assignment.groupId,
              groupName: assignment.group.name,
              availableFrom: assignment.availableFrom,
              availableUntil: assignment.availableUntil,
              attempts: attempts.length,
              latestAttempt: attempts[0] || null,
            });
            seenUserIds.add(member.user.id);
          }
        }
      }
    }

    return examinees;
  }

  async revokeAssignment(
    examId: string,
    assignmentId: string,
    userId: string,
    userRole: Role,
  ) {
    await this.findOne(examId, userId, userRole);

    const assignment = await this.prisma.examAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment || assignment.examId !== examId) {
      throw new NotFoundException('Assignment not found');
    }

    // Check if user has started the exam
    if (assignment.userId) {
      const attempts = await this.prisma.examAttempt.findMany({
        where: {
          examId,
          userId: assignment.userId,
          status: { not: AttemptStatus.NOT_STARTED },
        },
      });

      if (attempts.length > 0) {
        throw new BadRequestException(
          'Cannot revoke assignment - user has already started the exam',
        );
      }
    }

    return this.prisma.examAssignment.delete({
      where: { id: assignmentId },
    });
  }

  async startAttempt(examId: string, userId: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: {
        questions: true,
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (exam.status !== ExamStatus.PUBLISHED) {
      throw new BadRequestException('Exam is not available');
    }

    // Check if user is assigned
    const assignment = await this.prisma.examAssignment.findFirst({
      where: {
        examId,
        OR: [
          { userId },
          {
            group: {
              groupMembers: {
                some: { userId },
              },
            },
          },
        ],
      },
    });

    if (!assignment) {
      throw new ForbiddenException('You are not assigned to this exam');
    }

    // Check availability window
    const now = new Date();
    if (assignment.availableFrom && now < assignment.availableFrom) {
      throw new BadRequestException('Exam is not yet available');
    }
    if (assignment.availableUntil && now > assignment.availableUntil) {
      throw new BadRequestException('Exam is no longer available');
    }

    // Check attempt limit
    const attemptCount = await this.prisma.examAttempt.count({
      where: { examId, userId },
    });

    if (attemptCount >= exam.maxAttempts) {
      throw new BadRequestException('Maximum number of attempts reached');
    }

    // Create new attempt
    return this.prisma.examAttempt.create({
      data: {
        examId,
        userId,
        status: AttemptStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
      include: {
        exam: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                type: true,
                content: true,
                options: true,
                points: true,
                order: true,
                // Don't include correctAnswer for security
              },
            },
          },
        },
      },
    });
  }

  async submitAnswers(
    attemptId: string,
    submitDto: SubmitAnswerDto,
    userId: string,
  ) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException('This is not your attempt');
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException('This attempt is not in progress');
    }

    return this.prisma.$transaction(async (tx) => {
      let totalScore = 0;
      let totalPoints = 0;

      // Process each answer
      for (const answerDto of submitDto.answers) {
        const question = attempt.exam.questions.find(
          (q) => q.id === answerDto.questionId,
        );
        if (!question) continue;

        totalPoints += question.points;

        // Auto-grade multiple choice
        let score: number | null = null;
        if (question.type === 'MULTIPLE_CHOICE' && question.correctAnswer) {
          const userAnswer = answerDto.answerContent;
          const correctAnswer = question.correctAnswer;

          if (JSON.stringify(userAnswer) === JSON.stringify(correctAnswer)) {
            score = question.points;
            totalScore += score;
          } else {
            score = 0;
          }
        }

        // Create or update answer
        await tx.answer.upsert({
          where: {
            attemptId_questionId: {
              attemptId,
              questionId: answerDto.questionId,
            },
          },
          create: {
            attemptId,
            questionId: answerDto.questionId,
            answerContent: answerDto.answerContent,
            score,
          },
          update: {
            answerContent: answerDto.answerContent,
            score,
          },
        });
      }

      // Update attempt
      const finalScore = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;

      return tx.examAttempt.update({
        where: { id: attemptId },
        data: {
          status: AttemptStatus.COMPLETED,
          completedAt: new Date(),
          score: finalScore,
        },
        include: {
          exam: true,
          answers: {
            include: {
              question: true,
            },
          },
        },
      });
    });
  }

  async getAttempt(attemptId: string, userId: string, userRole: Role) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        exam: {
          include: {
            creator: true,
            questions: {
              orderBy: { order: 'asc' },
            },
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    // Check permission
    const isOwner = attempt.userId === userId;
    const isCreator = attempt.exam.creatorId === userId;
    const isAdmin = userRole === Role.ADMIN;

    if (!isOwner && !isCreator && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to view this attempt',
      );
    }

    return attempt;
  }

  async gradeAnswer(
    attemptId: string,
    questionId: string,
    gradeDto: GradeAnswerDto,
    userId: string,
    userRole: Role,
  ) {
    const attempt = await this.getAttempt(attemptId, userId, userRole);

    // Only creator or admin can grade
    if (attempt.exam.creatorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to grade this answer',
      );
    }

    const answer = await this.prisma.answer.findUnique({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
      include: {
        question: true,
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    // Validate score doesn't exceed question points
    if (gradeDto.score > answer.question.points) {
      throw new BadRequestException('Score cannot exceed question points');
    }

    // Update answer
    const updated = await this.prisma.answer.update({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
      data: {
        score: gradeDto.score,
        feedback: gradeDto.feedback,
      },
    });

    // Recalculate total score
    const allAnswers = await this.prisma.answer.findMany({
      where: { attemptId },
      include: {
        question: true,
      },
    });

    let totalScore = 0;
    let totalPoints = 0;
    let allGraded = true;

    for (const ans of allAnswers) {
      totalPoints += ans.question.points;
      if (ans.score !== null) {
        totalScore += ans.score;
      } else {
        allGraded = false;
      }
    }

    // Update attempt score if all answers are graded
    if (allGraded && totalPoints > 0) {
      const finalScore = (totalScore / totalPoints) * 100;
      await this.prisma.examAttempt.update({
        where: { id: attemptId },
        data: { score: finalScore },
      });
    }

    return updated;
  }

  async getExamAnalytics(examId: string, userId: string, userRole: Role) {
    await this.findOne(examId, userId, userRole);

    const attempts = await this.prisma.examAttempt.findMany({
      where: {
        examId,
        status: AttemptStatus.COMPLETED,
        score: { not: null },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    const scores = attempts
      .map((a) => a.score)
      .filter((s): s is number => s !== null);
    const totalAttempts = attempts.length;
    const averageScore =
      totalAttempts > 0 ? scores.reduce((a, b) => a + b, 0) / totalAttempts : 0;
    const passCount = scores.filter((s) => s >= exam.passingGrade).length;
    const passRate = totalAttempts > 0 ? (passCount / totalAttempts) * 100 : 0;

    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    return {
      examId,
      totalAttempts,
      averageScore,
      passRate,
      passCount,
      failCount: totalAttempts - passCount,
      highestScore,
      lowestScore,
      passingGrade: exam.passingGrade,
      recentAttempts: attempts.slice(0, 10).map((a) => ({
        id: a.id,
        user: a.user,
        score: a.score,
        completedAt: a.completedAt,
      })),
    };
  }

  async bulkOperations(
    bulkDto: BulkOperationsDto,
    userId: string,
    userRole: Role,
  ) {
    const { examIds, operation } = bulkDto;

    // Verify all exams exist and user has permission
    const exams = await this.prisma.exam.findMany({
      where: {
        id: { in: examIds },
      },
    });

    if (exams.length !== examIds.length) {
      throw new NotFoundException('One or more exams not found');
    }

    // Check permissions - non-admin users can only operate on their own exams
    if (userRole !== Role.ADMIN) {
      const unauthorizedExam = exams.find((exam) => exam.creatorId !== userId);
      if (unauthorizedExam) {
        throw new ForbiddenException(
          'You do not have permission to perform this operation on all selected exams',
        );
      }
    }

    switch (operation) {
      case BulkOperationType.PUBLISH: {
        return this.prisma.exam.updateMany({
          where: { id: { in: examIds } },
          data: { status: ExamStatus.PUBLISHED },
        });
      }

      case BulkOperationType.UNPUBLISH: {
        return this.prisma.exam.updateMany({
          where: { id: { in: examIds } },
          data: { status: ExamStatus.DRAFT },
        });
      }

      case BulkOperationType.DELETE: {
        // Check if any exam has attempts
        const examsWithAttempts = await this.prisma.examAttempt.findFirst({
          where: {
            examId: { in: examIds },
          },
        });

        if (examsWithAttempts) {
          throw new BadRequestException(
            'Cannot delete exams that have exam attempts',
          );
        }

        return this.prisma.exam.deleteMany({
          where: { id: { in: examIds } },
        });
      }

      default: {
        throw new BadRequestException('Invalid operation');
      }
    }
  }
}
