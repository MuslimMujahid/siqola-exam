import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
  imports: [PrismaModule],
})
export class GroupsModule {}
