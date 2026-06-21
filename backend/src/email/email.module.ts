import { Module, Global } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { AwsSesProvider } from './providers/aws-ses.provider';
import { ResendProvider } from './providers/resend.provider';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    EmailService,
    {
      provide: 'EMAIL_PROVIDER',
      useFactory: (configService: ConfigService) => {
        const awsAccessKey = configService.get<string>('AWS_ACCESS_KEY_ID');
        const awsSecretKey = configService.get<string>('AWS_SECRET_ACCESS_KEY');
        const awsRegion = configService.get<string>('AWS_REGION');
        const awsFromEmail = configService.get<string>('AWS_SES_FROM_EMAIL');

        const resendApiKey = configService.get<string>('RESEND_API_KEY');
        const resendFromEmail = configService.get<string>('RESEND_FROM_EMAIL');

        if (awsAccessKey && awsSecretKey && awsRegion && awsFromEmail) {
          return new AwsSesProvider({
            accessKeyId: awsAccessKey,
            secretAccessKey: awsSecretKey,
            region: awsRegion,
            fromEmail: awsFromEmail,
          });
        } else if (resendApiKey && resendFromEmail) {
          return new ResendProvider({
            apiKey: resendApiKey,
            fromEmail: resendFromEmail,
          });
        } else {
          const errorMsg = 'Email startup configuration failed: Neither AWS SES credentials nor Resend credentials are available.';
          throw new Error(errorMsg);
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
