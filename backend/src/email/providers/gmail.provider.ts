import * as nodemailer from 'nodemailer';
import { EmailProvider } from '../email-provider.interface';
import { Logger } from '@nestjs/common';

export class GmailProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;
  private user: string;
  private readonly logger = new Logger('GmailProvider');

  constructor(config: { user: string; pass: string }) {
    this.user = config.user;
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  async sendEmail(to: string, subject: string, htmlContent: string, qrCodeBuffer?: Buffer): Promise<void> {
    this.logger.log(`[EMAIL] [DIAGNOSTICS] Attempting to send email to ${to} using Gmail SMTP`);
    
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"AWS Community Day REC 2026" <${this.user}>`,
      to,
      subject,
      html: htmlContent,
    };

    if (qrCodeBuffer) {
      mailOptions.attachments = [
        {
          filename: 'qrcode.png',
          content: qrCodeBuffer,
          cid: 'qrcode', // For inline img rendering with <img src="cid:qrcode">
          headers: {
            'Content-Disposition': 'inline',
          },
        },
        {
          filename: 'qr-code.png', // Downloadable attachment
          content: qrCodeBuffer,
        },
      ];
    }

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`[EMAIL] [DIAGNOSTICS] Email successfully delivered to ${to} via Gmail SMTP`);
    } catch (error: any) {
      this.logger.error(`[EMAIL] [DIAGNOSTICS] Email delivery failed for ${to} via Gmail SMTP: ${error.message}`);
      throw error;
    }
  }
}
