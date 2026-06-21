import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterParticipantDto {
  @ApiProperty({ example: 'Arjun Sharma', description: 'Participant Full Name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'arjun@college.edu.in', description: 'Participant Email Address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+91 98765 43210', description: 'Participant Phone Number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Rajalakshmi Engineering College', description: 'College or Organization' })
  @IsString()
  @IsNotEmpty()
  organization: string;

  @ApiProperty({ example: '3rd Year B.Tech', description: 'Designation or Year of study' })
  @IsString()
  @IsNotEmpty()
  designation: string;

  @ApiProperty({ example: 'Chennai', description: 'City' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'man', description: 'Avatar style, e.g. "man" or "woman"' })
  @IsString()
  @IsNotEmpty()
  avatar: string;
}
