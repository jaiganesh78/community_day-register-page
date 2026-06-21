import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendQrDto {
  @ApiProperty({ example: 'arjun@college.edu.in', description: 'Participant Email Address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
