import { ApiProperty } from '@nestjs/swagger';

export class MasturbationTrendItemDto {
  @ApiProperty({ description: '일자', example: '2026-05-19' })
  date: string;

  @ApiProperty({ description: '해당 일자 자위 횟수', example: 1 })
  count: number;
}

export class MasturbationStatisticsResponseDto {
  @ApiProperty({ description: '통계 기준 일자', example: '2026-05-19' })
  referenceDate: string;

  @ApiProperty({ description: '이번 주 자위 횟수', example: 3 })
  weeklyCount: number;

  @ApiProperty({ description: '이번 달 자위 횟수', example: 10 })
  monthlyCount: number;

  @ApiProperty({ description: '연속 절제 일수', example: 5 })
  abstinenceStreakDays: number;

  @ApiProperty({
    description: '최근 7일 추이',
    type: [MasturbationTrendItemDto],
  })
  recent7Days: MasturbationTrendItemDto[];

  @ApiProperty({
    description: '최근 30일 추이',
    type: [MasturbationTrendItemDto],
  })
  recent30Days: MasturbationTrendItemDto[];
}
