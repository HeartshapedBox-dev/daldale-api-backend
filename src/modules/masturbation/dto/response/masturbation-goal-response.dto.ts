import { ApiProperty } from '@nestjs/swagger';
import { GoalType } from '@prisma/client';

export class MasturbationGoalResponseDto {
  @ApiProperty({ description: '목표 ID', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: '사용자 ID', example: 'clx1234567890' })
  userId: string;

  @ApiProperty({
    description: '목표 유형',
    enum: GoalType,
    example: GoalType.WEEKLY_COUNT,
  })
  type: GoalType;

  @ApiProperty({ description: '주간 목표 횟수', example: 3, required: false })
  weeklyTargetCount?: number | null;

  @ApiProperty({
    description: '연속 절제 목표 일수',
    example: 14,
    required: false,
  })
  abstinenceTargetDays?: number | null;

  @ApiProperty({
    description: '목표 시작 일자',
    example: '2026-05-19T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: '목표 종료 일자',
    example: '2026-06-19T00:00:00.000Z',
    required: false,
  })
  endDate?: Date | null;

  @ApiProperty({ description: '활성 여부', example: true })
  isActive: boolean;

  @ApiProperty({ description: '생성일', example: '2026-05-19T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정일', example: '2026-05-19T00:00:00.000Z' })
  updatedAt: Date;
}
