import { Controller, Post, Body, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegisterParticipantDto } from './dto/register-participant.dto';
import { ResendQrDto } from './dto/resend-qr.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Registrations')
@Controller('registrations')
export class RegistrationController {
  constructor(private registrationService: RegistrationService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute per IP
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a participant' })
  @ApiResponse({ status: 200, description: 'Registration processed (returns SUCCESS or ALREADY_REGISTERED status)' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async register(@Body() registerParticipantDto: RegisterParticipantDto) {
    return this.registrationService.registerParticipant(registerParticipantDto);
  }

  @Post('resend-qr')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend registration QR code' })
  @ApiResponse({ status: 200, description: 'QR pass email resent successfully' })
  @ApiResponse({ status: 400, description: 'Participant not found / email sending failed' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded (max 3 times per 15 minutes)' })
  async resendQr(@Body() resendQrDto: ResendQrDto) {
    return this.registrationService.resendQrCode(resendQrDto.email);
  }
}
