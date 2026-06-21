import { Inject, Injectable } from '@nestjs/common';
import type { EmailProvider } from './email-provider.interface';

@Injectable()
export class EmailService {
  constructor(
    @Inject('EMAIL_PROVIDER') private readonly provider: EmailProvider,
  ) {}

  async sendEmail(to: string, subject: string, htmlContent: string, qrCodeBuffer?: Buffer): Promise<void> {
    await this.provider.sendEmail(to, subject, htmlContent, qrCodeBuffer);
  }

  async sendRegistrationEmail(
    name: string,
    email: string,
    registrationCode: string,
    qrCodeBuffer: Buffer,
  ): Promise<void> {
    const subject = `Your AWS Community Day REC 2026 Entry Pass - ${registrationCode}`;
    const htmlContent = this.getRegistrationEmailHtml(name, registrationCode);
    await this.sendEmail(email, subject, htmlContent, qrCodeBuffer);
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
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #020205;
              color: #f8fafc;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #070712;
              border: 1px solid rgba(0, 240, 255, 0.2);
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 8px 32px 0 rgba(0, 240, 255, 0.1);
            }
            .header {
              background: linear-gradient(90deg, #0070f3, #00f0ff);
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              color: #ffffff;
              font-weight: 900;
              letter-spacing: 2px;
              text-transform: uppercase;
            }
            .header p {
              margin: 5px 0 0 0;
              color: #e2e8f0;
              font-size: 14px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
              line-height: 1.6;
              color: #cbd5e1;
            }
            .greeting {
              font-size: 18px;
              color: #ffffff;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .pass-card {
              background-color: #020205;
              border: 1px dashed rgba(0, 240, 255, 0.3);
              border-radius: 12px;
              padding: 25px;
              text-align: center;
              margin: 30px 0;
            }
            .pass-card h2 {
              margin: 0 0 5px 0;
              color: #00f0ff;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .registration-code {
              font-size: 28px;
              font-weight: 900;
              color: #ffffff;
              letter-spacing: 3px;
              margin: 10px 0;
            }
            .qr-image {
              margin-top: 15px;
              display: inline-block;
              padding: 10px;
              background-color: white;
              border-radius: 8px;
            }
            .qr-image img {
              display: block;
              width: 180px;
              height: 180px;
            }
            .notice-box {
              background: rgba(30, 41, 59, 0.4);
              border-left: 4px solid #00f0ff;
              padding: 15px;
              border-radius: 0 8px 8px 0;
              margin-top: 25px;
            }
            .notice-box p {
              margin: 0;
              font-size: 13px;
              color: #94a3b8;
            }
            .notice-box strong {
              color: #00f0ff;
            }
            .footer {
              background: #04060c;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #1e293b;
              font-size: 12px;
              color: #64748b;
            }
            .footer p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>AWS Community Day REC</h1>
              <p>AWS Student Builder Groups REC</p>
            </div>
            <div class="content">
              <div class="greeting">Hello ${name},</div>
              <p>Your registration for the <strong>AWS Community Day REC 2026</strong> has been successfully confirmed!</p>
              <p>Below is your digital entry pass. Please save this email and present the QR code at the registration desk on the day of the event.</p>
              
              <div class="pass-card">
                <h2>Your Registration Code</h2>
                <div class="registration-code">${code}</div>
                <div class="qr-image">
                  <img src="cid:qrcode" alt="Entry QR Code">
                </div>
              </div>

              <div class="notice-box">
                <p><strong>IMPORTANT NOTICE:</strong> This QR code will be required at the venue for:
                <br>1. <strong>Entry Verification</strong> at the gates.
                <br>2. <strong>Goodies Collection</strong> during the swag distribution sessions.</p>
              </div>

              <p style="margin-top: 25px;"><strong>Event Details:</strong><br>
              📅 Date: Saturday, September 12, 2026<br>
              ⏰ Time: 9:00 AM onwards<br>
              📍 Venue: Rajalakshmi Engineering College (REC), Tech Hall, Chennai</p>
            </div>
            <div class="footer">
              <p>Organized by AWS Student Builder Groups REC</p>
              <p>This is an automated registration email. Please do not reply directly.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
