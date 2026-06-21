import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { QrModule } from './qr/qr.module';
import { RegistrationModule } from './registration/registration.module';
import { OrganizerModule } from './organizer/organizer.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60, // Default general rate-limiting
    }]),
    PrismaModule,
    AuthModule,
    EmailModule,
    QrModule,
    RegistrationModule,
    OrganizerModule,
    ActivityLogModule,
    HealthModule,
  ],
})
export class AppModule {}
