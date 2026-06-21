import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'organizer@awscommunityday.com', description: 'Organizer Email Address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Admin@123', description: 'Organizer Password' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
