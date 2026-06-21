import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'AdminNew@123', description: 'New password, minimum 8 characters' })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
