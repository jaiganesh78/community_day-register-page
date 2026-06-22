import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterParticipantDto } from './dto/register-participant.dto';
import { QrService } from '../qr/qr.service';
import { EmailService } from '../email/email.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { UserRole, EmailStatus, ActivityType } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class RegistrationService {
  constructor(
    private prisma: PrismaService,
    private qrService: QrService,
    private emailService: EmailService,
    private activityLogService: ActivityLogService,
  ) {}

  async registerParticipant(dto: RegisterParticipantDto) {
    // 1. Verify Event Config
    const config = await this.prisma.eventConfig.findFirst();
    if (!config) {
      throw new BadRequestException('Event configuration is not set up.');
    }
    if (!config.registrationsOpen) {
      throw new BadRequestException('Registrations are currently closed for this event.');
    }

    // 2. Check Duplicate Email
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        deletedAt: null,
      },
      include: {
        registration: true,
      },
    });

    if (existingUser) {
      if (existingUser.role === UserRole.PARTICIPANT && existingUser.registration) {
        const qrDataUrl = await this.qrService.generateQrCodeDataUrl(existingUser.registration.registrationCode);
        return {
          status: 'ALREADY_REGISTERED',
          registrationCode: existingUser.registration.registrationCode,
          qrImage: qrDataUrl,
          user: {
            name: existingUser.name,
            email: existingUser.email,
            organization: existingUser.organization,
            designation: existingUser.designation,
            avatar: existingUser.avatar,
          },
        };
      }
      throw new BadRequestException('This email address is already registered under a different role.');
    }

    // 3. Generate Unique Registration Code
    const registrationCode = await this.generateUniqueCode(config.registrationPrefix);

    // 4. Generate Secure QR Token
    const qrToken = crypto.randomBytes(32).toString('hex');

    // 5. Database Insert via Transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: dto.fullName,
          email: dto.email,
          phone: dto.phone,
          role: UserRole.PARTICIPANT,
          organization: dto.organization,
          designation: dto.designation,
          city: dto.city,
          avatar: dto.avatar,
          isActive: true,
          mustChangePassword: false,
        },
      });

      const registration = await tx.registration.create({
        data: {
          userId: user.id,
          registrationCode,
          qrToken,
          emailStatus: EmailStatus.PENDING,
        },
      });

      return { user, registration };
    });

    // Write participant registered log
    await this.activityLogService.log(
      ActivityType.PARTICIPANT_REGISTERED,
      result.user.id,
      { registrationCode },
    );

    // 6. Generate QR Image representations
    const qrBuffer = await this.qrService.generateQrCodeBuffer(registrationCode);
    const qrDataUrl = await this.qrService.generateQrCodeDataUrl(registrationCode);

    // 7. Dispatch Email automatically immediately after registration
    try {
      await this.emailService.sendRegistrationEmail(
        result.user.id,
        result.user.name,
        result.user.email,
        registrationCode,
        qrBuffer,
      );
    } catch (error) {
      console.error('[RegistrationService] Initial registration email dispatch failed:', error);
      // Registration remains committed; delivery status is tracked inside EmailService
    }

    return {
      status: 'SUCCESS',
      registrationCode,
      qrToken,
      qrImage: qrDataUrl,
      user: {
        name: result.user.name,
        email: result.user.email,
        organization: result.user.organization,
        designation: result.user.designation,
        avatar: result.user.avatar,
      },
    };
  }

  async resendQrCode(email: string) {
    // 1. Rate Limit Check: 3 requests per 15 minutes per email
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const logs = await this.prisma.activityLog.count({
      where: {
        action: ActivityType.QR_RESENT,
        user: { email },
        createdAt: { gte: fifteenMinutesAgo },
      },
    });

    if (logs >= 3) {
      throw new HttpException(
        'Too many QR code resend attempts. Please wait 15 minutes and try again.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 2. Find User
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        role: UserRole.PARTICIPANT,
        deletedAt: null,
      },
      include: {
        registration: true,
      },
    });

    if (!user || !user.registration) {
      throw new BadRequestException('Participant registration not found.');
    }

    const reg = user.registration;

    // 3. Re-generate QR Code and Send Email
    const qrBuffer = await this.qrService.generateQrCodeBuffer(reg.registrationCode);

    try {
      await this.emailService.sendRegistrationEmail(
        user.id,
        user.name,
        user.email,
        reg.registrationCode,
        qrBuffer,
      );

      await this.activityLogService.log(
        ActivityType.QR_RESENT,
        user.id,
        { email: user.email, registrationCode: reg.registrationCode },
      );

      return {
        message: 'Registration QR code has been resent to your email address.',
      };
    } catch (error: any) {
      console.error('[RegistrationService] QR Resend email failed:', error);
      throw new BadRequestException(`Failed to send QR code email: ${error.message}`);
    }
  }

  private async generateUniqueCode(prefix: string): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let isUnique = false;
    let code = '';

    while (!isUnique) {
      let randPart = '';
      for (let i = 0; i < 8; i++) {
        randPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      code = `${prefix}-${randPart}`;

      const existing = await this.prisma.registration.findUnique({
        where: { registrationCode: code },
      });

      if (!existing) {
        isUnique = true;
      }
    }

    return code;
  }
}
