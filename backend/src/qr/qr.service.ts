import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  private jwtSecret: string;

  constructor(configService: ConfigService) {
    this.jwtSecret = configService.get<string>('JWT_SECRET', 'super-secret-cyber-neon-aws-community-day-jwt-key');
  }

  generateSignature(registrationCode: string): string {
    return crypto
      .createHmac('sha256', this.jwtSecret)
      .update(registrationCode)
      .digest('hex');
  }

  verifySignature(registrationCode: string, signature: string): boolean {
    if (!registrationCode || !signature) {
      return false;
    }
    const expected = this.generateSignature(registrationCode);
    if (expected.length !== signature.length) {
      return false;
    }
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  }

  async generateQrCodeDataUrl(registrationCode: string): Promise<string> {
    const signature = this.generateSignature(registrationCode);
    const payload = JSON.stringify({ registrationCode, signature });
    return QRCode.toDataURL(payload, { margin: 1, width: 300 });
  }

  async generateQrCodeBuffer(registrationCode: string): Promise<Buffer> {
    const signature = this.generateSignature(registrationCode);
    const payload = JSON.stringify({ registrationCode, signature });
    return QRCode.toBuffer(payload, { margin: 1, width: 300 });
  }
}
