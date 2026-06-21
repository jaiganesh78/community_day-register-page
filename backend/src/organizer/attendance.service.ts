import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QrService } from '../qr/qr.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { VerifyQrDto, VerificationAction } from './dto/verify-qr.dto';
import { ActivityType } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private qrService: QrService,
    private activityLogService: ActivityLogService,
  ) {}

  async verifyRecord(dto: VerifyQrDto, organizerId: string) {
    // 1. Verify Cryptographic QR Signature on Backend
    const isSignatureValid = this.qrService.verifySignature(dto.registrationCode, dto.signature);
    if (!isSignatureValid) {
      throw new BadRequestException('Invalid QR code signature. Potential tampering detected.');
    }

    // 2. Fetch Registration Record
    const registration = await this.prisma.registration.findFirst({
      where: {
        registrationCode: dto.registrationCode,
        user: {
          deletedAt: null, // Exclude soft-deleted users
        },
      },
      include: {
        user: true,
      },
    });

    if (!registration) {
      throw new BadRequestException('Registration not found or participant record is deleted.');
    }

    const user = registration.user;
    const now = new Date();

    // 3. Extensible Actions check (Entry vs Goodies)
    if (dto.action === VerificationAction.ENTRY) {
      if (registration.entryVerified) {
        return {
          status: 'ALREADY_VERIFIED',
          message: 'This ticket has already been verified.',
          verifiedAt: registration.entryVerifiedAt,
          participant: {
            name: user.name,
            email: user.email,
            organization: user.organization,
          },
        };
      }

      // Mark Checked In
      await this.prisma.registration.update({
        where: { id: registration.id },
        data: {
          entryVerified: true,
          entryVerifiedAt: now,
        },
      });

      await this.activityLogService.log(
        ActivityType.ENTRY_VERIFIED,
        user.id,
        { verifiedBy: organizerId, timestamp: now },
      );

      return {
        status: 'SUCCESS',
        message: 'Entry verified successfully.',
        verifiedAt: now,
        participant: {
          name: user.name,
          email: user.email,
          organization: user.organization,
        },
      };
    } else if (dto.action === VerificationAction.GOODIES) {
      // Check EventConfig to see if goodies distribution is enabled
      const config = await this.prisma.eventConfig.findFirst();
      if (config && !config.goodiesEnabled) {
        throw new BadRequestException('Goodies distribution is currently disabled by configuration.');
      }

      if (registration.goodiesVerified) {
        return {
          status: 'ALREADY_CLAIMED',
          message: 'Goodies for this ticket have already been claimed.',
          verifiedAt: registration.goodiesVerifiedAt,
          participant: {
            name: user.name,
            email: user.email,
            organization: user.organization,
          },
        };
      }

      // Mark Goodies Claimed
      await this.prisma.registration.update({
        where: { id: registration.id },
        data: {
          goodiesVerified: true,
          goodiesVerifiedAt: now,
        },
      });

      await this.activityLogService.log(
        ActivityType.GOODIES_CLAIMED,
        user.id,
        { verifiedBy: organizerId, timestamp: now },
      );

      return {
        status: 'SUCCESS',
        message: 'Goodies distribution claimed successfully.',
        verifiedAt: now,
        participant: {
          name: user.name,
          email: user.email,
          organization: user.organization,
        },
      };
    } else {
      throw new BadRequestException(`Unsupported attendance check action: ${dto.action}`);
    }
  }
}
