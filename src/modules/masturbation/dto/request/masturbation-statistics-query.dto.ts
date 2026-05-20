import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class MasturbationStatisticsQueryDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'clx1234567890',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '통계 기준 일자',
    example: '2026-05-19',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  referenceDate?: string;
}
