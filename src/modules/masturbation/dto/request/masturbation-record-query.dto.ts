import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class MasturbationRecordQueryDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'clx1234567890',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '조회 시작 일자',
    example: '2026-05-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiProperty({
    description: '조회 종료 일자',
    example: '2026-05-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  to?: string;
}
