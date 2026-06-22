import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { EmailProvider } from '../email-provider.interface';
import { Logger } from '@nestjs/common';

export class AwsSesProvider implements EmailProvider {
  private client: SESClient;
  private fromEmail: string;
  private readonly logger = new Logger('AwsSesProvider');

  constructor(config: { accessKeyId: string; secretAccessKey: string; region: string; fromEmail: string }) {
    this.client = new SESClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.fromEmail = config.fromEmail;
  }

  async sendEmail(to: string, subject: string, htmlContent: string, qrCodeBuffer?: Buffer): Promise<void> {
    this.logger.log(`[EMAIL] [DIAGNOSTICS] Attempting to send email to ${to} using AWS SES`);

    if (!qrCodeBuffer) {
      const rawMessage = [
        `From: ${this.fromEmail}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=UTF-8`,
        ``,
        htmlContent,
      ].join('\r\n');

      try {
        await this.client.send(
          new SendRawEmailCommand({
            RawMessage: {
              Data: Buffer.from(rawMessage),
            },
          }),
        );
        this.logger.log(`[EMAIL] [DIAGNOSTICS] Email successfully delivered to ${to} via AWS SES (no attachments)`);
      } catch (error: any) {
        this.logger.error(`[EMAIL] [DIAGNOSTICS] Email delivery failed for ${to} via AWS SES: ${error.message}`);
        throw error;
      }
      return;
    }

    // MIME structure: multipart/mixed (containing a multipart/related block and a separate attachment block)
    const mixedBoundary = 'boundary-aws-community-day-mixed';
    const relatedBoundary = 'boundary-aws-community-day-related';

    const rawMessage = [
      `From: ${this.fromEmail}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`,
      ``,
      `--${mixedBoundary}`,
      `Content-Type: multipart/related; boundary="${relatedBoundary}"`,
      ``,
      `--${relatedBoundary}`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      htmlContent,
      ``,
      `--${relatedBoundary}`,
      `Content-Type: image/png; name="qrcode.png"`,
      `Content-Transfer-Encoding: base64`,
      `Content-Disposition: inline; filename="qrcode.png"`,
      `Content-ID: <qrcode>`,
      ``,
      qrCodeBuffer.toString('base64'),
      ``,
      `--${relatedBoundary}--`,
      ``,
      `--${mixedBoundary}`,
      `Content-Type: image/png; name="qr-code.png"`,
      `Content-Transfer-Encoding: base64`,
      `Content-Disposition: attachment; filename="qr-code.png"`,
      ``,
      qrCodeBuffer.toString('base64'),
      ``,
      `--${mixedBoundary}--`,
    ].join('\r\n');

    try {
      await this.client.send(
        new SendRawEmailCommand({
          RawMessage: {
            Data: Buffer.from(rawMessage),
          },
        }),
      );
      this.logger.log(`[EMAIL] [DIAGNOSTICS] Email successfully delivered to ${to} via AWS SES (with double QR attachments)`);
    } catch (error: any) {
      this.logger.error(`[EMAIL] [DIAGNOSTICS] Email delivery failed for ${to} via AWS SES: ${error.message}`);
      throw error;
    }
  }
}
