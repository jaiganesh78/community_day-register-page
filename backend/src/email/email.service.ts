import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { AwsSesProvider } from './providers/aws-ses.provider';
import { GmailProvider } from './providers/gmail.provider';
import { EmailProvider } from './email-provider.interface';
import { ActivityType } from '@prisma/client';

@Injectable()
export class EmailService implements OnModuleInit {
  private awsProvider: EmailProvider | null = null;
  private gmailProvider: EmailProvider | null = null;
  private readonly logger = new Logger('EmailService');

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private activityLogService: ActivityLogService,
  ) {
    const awsAccessKey = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const awsSecretKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const awsRegion = this.configService.get<string>('AWS_REGION');
    const awsFromEmail = this.configService.get<string>('AWS_SES_FROM_EMAIL');

    const gmailUser = this.configService.get<string>('GMAIL_USER');
    const gmailAppPassword = this.configService.get<string>('GMAIL_APP_PASSWORD');

    // Startup validation only checks for configuration presence (doesn't perform live connection checks)
    if (awsAccessKey && awsSecretKey && awsRegion && awsFromEmail) {
      this.awsProvider = new AwsSesProvider({
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
        region: awsRegion,
        fromEmail: awsFromEmail,
      });
    }

    if (gmailUser && gmailAppPassword) {
      this.gmailProvider = new GmailProvider({
        user: gmailUser,
        pass: gmailAppPassword,
      });
    }
  }

  onModuleInit() {
    const hasAws = !!this.awsProvider;
    const hasGmail = !!this.gmailProvider;

    if (hasAws && hasGmail) {
      console.log('[EMAIL] AWS SES Available');
      console.log('[EMAIL] Gmail SMTP Available');
      console.log('[EMAIL] Email Fallback Chain Ready');
      this.logger.log('AWS SES and Gmail SMTP fallback chain is ready.');
    } else if (hasAws && !hasGmail) {
      console.log('[EMAIL] AWS SES Available');
      console.log('[EMAIL] WARNING: Gmail fallback unavailable');
      this.logger.warn('AWS SES is configured but Gmail fallback is unavailable.');
    } else if (!hasAws && hasGmail) {
      console.log('[EMAIL] WARNING: AWS SES unavailable');
      console.log('[EMAIL] Gmail SMTP running as emergency provider');
      this.logger.warn('AWS SES is unavailable; Gmail SMTP will run as emergency provider.');
    } else {
      const errorMsg = 'Email startup configuration failed: Neither AWS SES nor Gmail SMTP is configured.';
      console.error('[EMAIL] ' + errorMsg);
      throw new Error(errorMsg);
    }
  }

  isAwsConfigured(): boolean {
    return !!this.awsProvider;
  }

  isGmailConfigured(): boolean {
    return !!this.gmailProvider;
  }

  async sendEmail(to: string, subject: string, htmlContent: string, qrCodeBuffer?: Buffer): Promise<void> {
    if (this.awsProvider) {
      try {
        await this.awsProvider.sendEmail(to, subject, htmlContent, qrCodeBuffer);
        return;
      } catch (err) {
        this.logger.warn(`AWS SES delivery failed, trying Gmail SMTP: ${err.message}`);
      }
    }
    if (this.gmailProvider) {
      await this.gmailProvider.sendEmail(to, subject, htmlContent, qrCodeBuffer);
      return;
    }
    throw new Error('No email provider is configured or available.');
  }

  async sendRegistrationEmail(
    userId: string,
    name: string,
    email: string,
    registrationCode: string,
    qrCodeBuffer: Buffer,
  ): Promise<void> {
    const subject = `Your AWS Community Day REC 2026 Entry Pass - ${registrationCode}`;
    const htmlContent = this.getRegistrationEmailHtml(name, registrationCode);
    const now = new Date();

    const registration = await this.prisma.registration.findUnique({
      where: { userId },
    });

    if (!registration) {
      throw new Error(`Registration record not found for user ID: ${userId}`);
    }

    // Phase 1: Attempt AWS SES
    if (this.awsProvider) {
      try {
        this.logger.log(`[EMAIL] Attempting AWS SES dispatch to: ${email}`);
        await this.awsProvider.sendEmail(email, subject, htmlContent, qrCodeBuffer);

        // Success Update
        await this.prisma.registration.update({
          where: { id: registration.id },
          data: {
            emailStatus: 'SENT',
            emailProvider: 'AWS_SES',
            emailSentAt: now,
            lastEmailAttemptAt: now,
            lastEmailError: null,
          },
        });

        // Audit Logs (does not overwrite delivery history - each attempt gets a new log)
        await this.activityLogService.log(
          'EMAIL_SENT_SES' as ActivityType,
          userId,
          { provider: 'AWS_SES', recipient: email, timestamp: now },
        );
        return;
      } catch (error: any) {
        this.logger.error(`[EMAIL] AWS SES delivery failed for ${email}: ${error.message}`);
        
        await this.activityLogService.log(
          'EMAIL_FAILED_SES' as ActivityType,
          userId,
          { provider: 'AWS_SES', recipient: email, errorMessage: error.message, timestamp: now },
        );
      }
    } else {
      this.logger.warn(`[EMAIL] AWS SES not configured, skipping to fallback.`);
    }

    // Phase 2: Attempt Gmail SMTP Fallback
    if (this.gmailProvider) {
      try {
        this.logger.log(`[EMAIL] Attempting Gmail SMTP Fallback dispatch to: ${email}`);
        await this.gmailProvider.sendEmail(email, subject, htmlContent, qrCodeBuffer);

        // Success Fallback Update
        await this.prisma.registration.update({
          where: { id: registration.id },
          data: {
            emailStatus: 'SENT',
            emailProvider: 'GMAIL_FALLBACK',
            emailSentAt: now,
            lastEmailAttemptAt: now,
            lastEmailError: null,
          },
        });

        await this.activityLogService.log(
          'EMAIL_FALLBACK_SUCCESS' as ActivityType,
          userId,
          { provider: 'GMAIL_FALLBACK', recipient: email, timestamp: now },
        );

        await this.activityLogService.log(
          'EMAIL_SENT_GMAIL' as ActivityType,
          userId,
          { provider: 'GMAIL_FALLBACK', recipient: email, timestamp: now },
        );
        return;
      } catch (error: any) {
        this.logger.error(`[EMAIL] Gmail SMTP fallback failed for ${email}: ${error.message}`);

        await this.prisma.registration.update({
          where: { id: registration.id },
          data: {
            emailStatus: 'FAILED',
            lastEmailAttemptAt: now,
            lastEmailError: error.message,
          },
        });

        await this.activityLogService.log(
          'EMAIL_FAILED_GMAIL' as ActivityType,
          userId,
          { provider: 'GMAIL_FALLBACK', recipient: email, errorMessage: error.message, timestamp: now },
        );
        throw error;
      }
    } else {
      // Both failed/unavailable
      const errorMsg = 'Email dispatch completely failed: AWS SES failed and Gmail fallback is not configured.';
      this.logger.error(errorMsg);

      await this.prisma.registration.update({
        where: { id: registration.id },
        data: {
          emailStatus: 'FAILED',
          lastEmailAttemptAt: now,
          lastEmailError: errorMsg,
        },
      });

      throw new Error(errorMsg);
    }
  }

  private getRegistrationEmailHtml(name: string, code: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AWS Community Day REC 2026 Entry Pass</title>
          <style>
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; }

            body {
              margin: 0;
              padding: 0;
              width: 100% !important;
              background-color: #020205;
              color: #cbd5e1;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .email-wrapper {
              width: 100%;
              background-color: #020205;
              padding: 20px 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #070712;
              border: 1px solid #00f0ff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 8px 32px 0 rgba(0, 240, 255, 0.15);
            }
            .email-header {
              background: linear-gradient(135deg, #0070f3 0%, #00f0ff 100%);
              padding: 40px 30px;
              text-align: center;
            }
            .email-header h1 {
              margin: 0;
              font-size: 26px;
              color: #ffffff;
              font-weight: 800;
              letter-spacing: 1.5px;
              text-transform: uppercase;
              text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            }
            .email-header p {
              margin: 8px 0 0 0;
              color: #e2e8f0;
              font-size: 14px;
              font-weight: 600;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            .email-body {
              padding: 40px 35px;
              color: #cbd5e1;
              line-height: 1.6;
            }
            .greeting {
              font-size: 20px;
              color: #ffffff;
              font-weight: 700;
              margin-bottom: 16px;
            }
            .intro-text {
              font-size: 15px;
              margin-bottom: 24px;
            }
            .pass-card {
              background-color: #04040a;
              border: 1px dashed rgba(0, 240, 255, 0.3);
              border-radius: 12px;
              padding: 30px;
              text-align: center;
              margin: 30px 0;
            }
            .pass-card h2 {
              margin: 0 0 8px 0;
              color: #00f0ff;
              font-size: 13px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .registration-code {
              font-family: 'Courier New', Courier, monospace;
              font-size: 32px;
              font-weight: 800;
              color: #ffffff;
              letter-spacing: 4px;
              margin: 10px 0;
            }
            .qr-image-container {
              margin: 20px auto 10px auto;
              display: inline-block;
              padding: 16px;
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
            }
            .qr-image-container img {
              display: block;
              width: 200px;
              height: 200px;
            }
            .details-list {
              margin: 30px 0;
              padding: 0;
              list-style: none;
            }
            .details-item {
              font-size: 14px;
              margin-bottom: 12px;
              color: #cbd5e1;
            }
            .details-item strong {
              color: #00f0ff;
            }
            .instruction-box {
              background: rgba(30, 41, 59, 0.5);
              border-left: 4px solid #00f0ff;
              padding: 20px;
              border-radius: 0 12px 12px 0;
              margin-top: 30px;
            }
            .instruction-box h4 {
              margin: 0 0 8px 0;
              color: #ffffff;
              font-size: 14px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .instruction-box p {
              margin: 0;
              font-size: 13px;
              color: #94a3b8;
              line-height: 1.5;
            }
            .contact-section {
              margin-top: 35px;
              padding-top: 25px;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
              font-size: 13px;
              color: #94a3b8;
            }
            .contact-section a {
              color: #00f0ff;
              text-decoration: none;
            }
            .email-footer {
              background-color: #04060c;
              padding: 25px;
              text-align: center;
              border-top: 1px solid rgba(0, 240, 255, 0.1);
              font-size: 12px;
              color: #64748b;
            }
            .email-footer p {
              margin: 6px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="email-container">
              <!-- Header -->
              <div class="email-header">
                <h1>AWS Community Day</h1>
                <p>AWS Student Builder Groups REC</p>
              </div>
              <!-- Body -->
              <div class="email-body">
                <div class="greeting">Hello ${name},</div>
                <p class="intro-text">
                  Your registration for the <strong>AWS Community Day REC 2026</strong> has been successfully confirmed! We are excited to have you join us for an inspiring day of cloud learning, networking, and expert sessions.
                </p>

                <!-- Pass Card -->
                <div class="pass-card">
                  <h2>Your Digital Entry Pass</h2>
                  <div class="registration-code">${code}</div>
                  <div class="qr-image-container">
                    <img src="cid:qrcode" alt="Event QR Entry Pass">
                  </div>
                  <p style="font-size: 11px; color: #94a3b8; margin: 10px 0 0 0;">Present this QR code (also attached as qr-code.png) at the reception desk.</p>
                </div>

                <!-- Event Details -->
                <ul class="details-list">
                  <li class="details-item">📅 <strong>Date:</strong> Saturday, September 12, 2026</li>
                  <li class="details-item">⏰ <strong>Time:</strong> 09:00 AM onwards (IST)</li>
                  <li class="details-item">📍 <strong>Venue:</strong> Rajalakshmi Engineering College (REC), Tech Hall, Chennai</li>
                </ul>

                <!-- Instructions Box -->
                <div class="instruction-box">
                  <h4>Important Instructions</h4>
                  <p>
                    1. <strong>Gate Access:</strong> Keep this QR code handy for entry clearance at the gates.
                    <br>2. <strong>Goodies Claim:</strong> This QR code is required at the swags counter to collect your goodies.
                    <br>3. <strong>Timeliness:</strong> Please arrive by 08:30 AM for registration and networking.
                  </p>
                </div>

                <!-- Contact Section -->
                <div class="contact-section">
                  <p>
                    Have questions or need assistance? Feel free to reach out to our organizing committee at <a href="mailto:organizer@awscommunityday.com">organizer@awscommunityday.com</a>.
                  </p>
                </div>
              </div>
              <!-- Footer -->
              <div class="email-footer">
                <p>© 2026 AWS Student Builder Groups REC. All rights reserved.</p>
                <p>This is an auto-generated confirmation. Please do not reply directly to this email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
