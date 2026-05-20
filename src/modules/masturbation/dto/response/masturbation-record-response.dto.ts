import { ApiProperty } from '@nestjs/swagger';

export class MasturbationRecordResponseDto {
  @ApiProperty({ description: '기록 ID', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: '사용자 ID', example: 'clx1234567890' })
  userId: string;

  @ApiProperty({
    description: '기록 일자',
    example: '2026-05-19T00:00:00.000Z',
  })
  date: Date;

  @ApiProperty({ description: '해당 일자 자위 횟수', example: 1 })
  count: number;

  @ApiProperty({
    description: '메모',
    example: '야간 충동 발생',
    required: false,
  })
  note?: string | null;

  @ApiProperty({ description: '생성일', example: '2026-05-19T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정일', example: '2026-05-19T00:00:00.000Z' })
  updatedAt: Date;
}
