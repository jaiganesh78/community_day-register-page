import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { EmailProvider } from '../email-provider.interface';

export class AwsSesProvider implements EmailProvider {
  private client: SESClient;
  private fromEmail: string;

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
    if (!qrCodeBuffer) {
      // Simple email without attachments
      const rawMessage = [
        `From: ${this.fromEmail}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=UTF-8`,
        ``,
        htmlContent,
      ].join('\r\n');

      await this.client.send(
        new SendRawEmailCommand({
          RawMessage: {
            Data: Buffer.from(rawMessage),
          },
        }),
      );
      return;
    }

    // Email with QR code attachment inline (CID)
    const boundary = 'boundary-aws-community-day';
    const rawMessage = [
      `From: ${this.fromEmail}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/related; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      htmlContent,
      ``,
      `--${boundary}`,
      `Content-Type: image/png; name="qrcode.png"`,
      `Content-Transfer-Encoding: base64`,
      `Content-Disposition: inline; filename="qrcode.png"`,
      `Content-ID: <qrcode>`,
      ``,
      qrCodeBuffer.toString('base64'),
      ``,
      `--${boundary}--`,
    ].join('\r\n');

    await this.client.send(
      new SendRawEmailCommand({
        RawMessage: {
          Data: Buffer.from(rawMessage),
        },
      }),
    );
  }
}
