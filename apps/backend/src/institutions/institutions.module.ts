import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { InstitutionsController } from './institutions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [InstitutionsController],
  providers: [InstitutionsService],
  exports: [InstitutionsService],
  imports: [PrismaModule],
})
export class InstitutionsModule {}
