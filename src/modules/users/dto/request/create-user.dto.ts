import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsEnum, IsDateString, IsNumber, Min } from 'class-validator';
import { Gender } from '../../enum/user.enum';

export class CreateUserDto {
  @ApiProperty({
    description: '이메일',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '이름',
    example: '홍길동',
    required: false,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '성별',
    enum: Gender,
    example: Gender.MALE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    description: '생년월일',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({
    description: '키 (cm)',
    example: 175.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: number;

  @ApiProperty({
    description: '몸무게 (kg)',
    example: 70.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiProperty({
    description: '이번 주 자위 횟수',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weeklyMasturbationCount?: number;
}

