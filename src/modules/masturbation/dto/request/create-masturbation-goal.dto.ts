import { ApiProperty } from '@nestjs/swagger';
import { GoalType } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMasturbationGoalDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'clx1234567890',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '목표 유형',
    enum: GoalType,
    example: GoalType.WEEKLY_COUNT,
  })
  @IsEnum(GoalType)
  type: GoalType;

  @ApiProperty({
    description: '주간 목표 횟수',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  weeklyTargetCount?: number;

  @ApiProperty({
    description: '연속 절제 목표 일수',
    example: 14,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  abstinenceTargetDays?: number;

  @ApiProperty({
    description: '목표 시작 일자',
    example: '2026-05-19',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: '목표 종료 일자',
    example: '2026-06-19',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: '활성 여부',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
