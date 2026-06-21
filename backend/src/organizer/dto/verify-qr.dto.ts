import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum VerificationAction {
  ENTRY = 'ENTRY',
  GOODIES = 'GOODIES',
}

export class VerifyQrDto {
  @ApiProperty({ example: 'AWSCD2026-8XH2J9', description: 'Registration Code' })
  @IsString()
  @IsNotEmpty()
  registrationCode: string;

  @ApiProperty({ example: 'a1b2c3d4...', description: 'Cryptographic signature from the QR code' })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({ example: 'ENTRY', enum: VerificationAction, description: 'The event action to verify' })
  @IsEnum(VerificationAction)
  @IsNotEmpty()
  action: VerificationAction;
}
