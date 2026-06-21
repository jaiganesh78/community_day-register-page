import { Controller, Get, Post, Delete, Body, Query, UseGuards, Req, Res, Param, HttpStatus, HttpCode } from '@nestjs/common';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceService } from './attendance.service';
import { VerifyQrDto } from './dto/verify-qr.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, EmailStatus, ActivityType, Prisma } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ActivityLogService } from '../activity-log/activity-log.service';

@ApiTags('Organizer Tools')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ORGANIZER)
@Controller('organizer')
export class OrganizerController {
  constructor(
    private prisma: PrismaService,
    private attendanceService: AttendanceService,
    private activityLogService: ActivityLogService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get organizer dashboard statistics' })
  async getDashboard() {
    const totalRegistrations = await this.prisma.user.count({
      where: { role: UserRole.PARTICIPANT, deletedAt: null },
    });

    const checkedIn = await this.prisma.registration.count({
      where: { entryVerified: true, user: { deletedAt: null } },
    });

    const pendingEntry = totalRegistrations - checkedIn;

    const goodiesDistributed = await this.prisma.registration.count({
      where: { goodiesVerified: true, user: { deletedAt: null } },
    });

    const pendingGoodies = totalRegistrations - goodiesDistributed;

    const checkInRate = totalRegistrations > 0 ? Math.round((checkedIn / totalRegistrations) * 100) : 0;
    const goodiesRate = totalRegistrations > 0 ? Math.round((goodiesDistributed / totalRegistrations) * 100) : 0;

    const emailFailures = await this.prisma.registration.count({
      where: { emailStatus: EmailStatus.FAILED, user: { deletedAt: null } },
    });

    const emailPending = await this.prisma.registration.count({
      where: { emailStatus: EmailStatus.PENDING, user: { deletedAt: null } },
    });

    // Today's registrations count
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todaysRegistrations = await this.prisma.user.count({
      where: {
        role: UserRole.PARTICIPANT,
        deletedAt: null,
        createdAt: { gte: startOfToday },
      },
    });

    // Recent activities (last 10)
    const recentActivity = await this.prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      metrics: {
        totalRegistrations,
        checkedIn,
        pendingEntry,
        goodiesDistributed,
        pendingGoodies,
        checkInRate,
        goodiesRate,
        emailFailures,
        emailPending,
        todaysRegistrations,
      },
      recentActivity,
    };
  }

  @Get('participants')
  @ApiOperation({ summary: 'Get searchable, filterable, paginated participants' })
  async getParticipants(
    @Query('search') search?: string,
    @Query('entryStatus') entryStatus?: 'checked-in' | 'pending',
    @Query('goodiesStatus') goodiesStatus?: 'claimed' | 'pending',
    @Query('emailStatus') emailStatus?: EmailStatus,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.UserWhereInput = this.buildFilterWhereClause(
      search,
      entryStatus,
      goodiesStatus,
      emailStatus,
    );

    // Dynamic sorting
    let orderBy: any = {};
    if (sortBy === 'name' || sortBy === 'email' || sortBy === 'createdAt') {
      orderBy = { [sortBy]: sortOrder };
    } else if (sortBy === 'registrationCode') {
      orderBy = { registration: { registrationCode: sortOrder } };
    } else if (sortBy === 'entryStatus') {
      orderBy = { registration: { entryVerified: sortOrder } };
    } else if (sortBy === 'goodiesStatus') {
      orderBy = { registration: { goodiesVerified: sortOrder } };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const [total, data] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          registration: true,
        },
      }),
    ]);

    return {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data,
    };
  }

  @Delete('participants/:id')
  @ApiOperation({ summary: 'Soft delete a participant' })
  async deleteParticipant(@Param('id') id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return {
      message: 'Participant soft deleted successfully.',
    };
  }

  @Get('participants/export')
  @ApiOperation({ summary: 'Export filtered list as CSV' })
  async exportParticipants(
    @Res() res: Response,
    @Req() req: any,
    @Query('search') search?: string,
    @Query('entryStatus') entryStatus?: 'checked-in' | 'pending',
    @Query('goodiesStatus') goodiesStatus?: 'claimed' | 'pending',
    @Query('emailStatus') emailStatus?: EmailStatus,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const where = this.buildFilterWhereClause(
      search,
      entryStatus,
      goodiesStatus,
      emailStatus,
    );

    let orderBy: any = {};
    if (sortBy === 'name' || sortBy === 'email' || sortBy === 'createdAt') {
      orderBy = { [sortBy]: sortOrder };
    } else if (sortBy === 'registrationCode') {
      orderBy = { registration: { registrationCode: sortOrder } };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const participants = await this.prisma.user.findMany({
      where,
      orderBy,
      include: {
        registration: true,
      },
    });

    const headers = [
      'Name',
      'Email',
      'Phone',
      'Organization',
      'Designation',
      'City',
      'Registration Code',
      'Entry Status',
      'Entry Timestamp',
      'Goodies Status',
      'Goodies Timestamp',
      'Email Status',
      'Created Date',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '';
      const s = String(str).replace(/"/g, '""');
      return s.includes(',') || s.includes('\n') || s.includes('"') ? `"${s}"` : s;
    };

    const rows = participants.map((p) => {
      const reg = p.registration;
      return [
        escapeCsv(p.name),
        escapeCsv(p.email),
        escapeCsv(p.phone),
        escapeCsv(p.organization),
        escapeCsv(p.designation),
        escapeCsv(p.city),
        escapeCsv(reg?.registrationCode),
        reg?.entryVerified ? 'Checked In' : 'Pending',
        reg?.entryVerifiedAt ? reg.entryVerifiedAt.toISOString() : 'N/A',
        reg?.goodiesVerified ? 'Claimed' : 'Pending',
        reg?.goodiesVerifiedAt ? reg.goodiesVerifiedAt.toISOString() : 'N/A',
        escapeCsv(reg?.emailStatus),
        p.createdAt.toISOString(),
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    await this.activityLogService.log(
      ActivityType.CSV_EXPORTED,
      req.user.id,
      { count: participants.length },
    );

    res.header('Content-Type', 'text/csv');
    res.attachment('aws-community-day-participants.csv');
    return res.status(HttpStatus.OK).send(csvContent);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify QR payload for entry or goodies' })
  @ApiResponse({ status: 200, description: 'Scan processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid QR signature or verification exception' })
  async verifyQr(@Body() verifyQrDto: VerifyQrDto, @Req() req: any) {
    return this.attendanceService.verifyRecord(verifyQrDto, req.user.id);
  }

  private buildFilterWhereClause(
    search?: string,
    entryStatus?: 'checked-in' | 'pending',
    goodiesStatus?: 'claimed' | 'pending',
    emailStatus?: EmailStatus,
  ): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {
      role: UserRole.PARTICIPANT,
      deletedAt: null, // Exclude soft deleted
    };

    const andConditions: Prisma.UserWhereInput[] = [];

    // Search query
    if (search) {
      const cleanSearch = search.trim();
      andConditions.push({
        OR: [
          { name: { contains: cleanSearch, mode: 'insensitive' } },
          { email: { contains: cleanSearch, mode: 'insensitive' } },
          { organization: { contains: cleanSearch, mode: 'insensitive' } },
          { designation: { contains: cleanSearch, mode: 'insensitive' } },
          { city: { contains: cleanSearch, mode: 'insensitive' } },
          { registration: { registrationCode: { contains: cleanSearch, mode: 'insensitive' } } },
        ],
      });
    }

    // Filter by entryStatus
    if (entryStatus) {
      andConditions.push({
        registration: {
          entryVerified: entryStatus === 'checked-in',
        },
      });
    }

    // Filter by goodiesStatus
    if (goodiesStatus) {
      andConditions.push({
        registration: {
          goodiesVerified: goodiesStatus === 'claimed',
        },
      });
    }

    // Filter by emailStatus
    if (emailStatus) {
      andConditions.push({
        registration: {
          emailStatus,
        },
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    return where;
  }
}
