import { Resend } from 'resend';
import { EmailProvider } from '../email-provider.interface';

export class ResendProvider implements EmailProvider {
  private resend: Resend;
  private fromEmail: string;

  constructor(config: { apiKey: string; fromEmail: string }) {
    this.resend = new Resend(config.apiKey);
    this.fromEmail = config.fromEmail;
  }

  async sendEmail(to: string, subject: string, htmlContent: string, qrCodeBuffer?: Buffer): Promise<void> {
    const attachments = qrCodeBuffer
      ? [
          {
            filename: 'qrcode.png',
            content: qrCodeBuffer,
            cid: 'qrcode',
          },
        ]
      : undefined;

    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject,
      html: htmlContent,
      attachments,
    });

    if (error) {
      throw new Error(`Resend email delivery failed: ${error.message}`);
    }
  }
}
