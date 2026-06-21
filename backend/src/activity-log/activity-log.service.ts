import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityType } from '@prisma/client';

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async log(action: ActivityType, userId?: string, metadata?: any) {
    try {
      return await this.prisma.activityLog.create({
        data: {
          action,
          userId: userId || null,
          metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
        },
      });
    } catch (error) {
      console.error('[ActivityLogService] Failed to write activity log:', error);
    }
  }
}
