import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateMasturbationRecordDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'clx1234567890',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '기록 일자',
    example: '2026-05-19',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    description: '해당 일자 자위 횟수',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  count?: number;

  @ApiProperty({
    description: '메모',
    example: '충동 감소',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
