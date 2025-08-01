import { IsNotEmpty, IsString, IsEmail, IsOptional, MaxLength, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({ description: 'ID of the feedback theme', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  feedbacksThemeId: number;

  @ApiPropertyOptional({ description: 'Name of the sender', maxLength: 255, example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ description: 'Email address', maxLength: 50, example: 'john@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @ApiProperty({ description: 'IP address of the sender', maxLength: 50, example: '192.168.1.1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  ip: string;

  @ApiProperty({ description: 'Feedback message', maxLength: 1000, example: 'This is my feedback message' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  message: string;
}
