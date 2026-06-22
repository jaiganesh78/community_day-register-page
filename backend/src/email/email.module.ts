import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Global()
@Module({
  imports: [ConfigModule, PrismaModule, ActivityLogModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
