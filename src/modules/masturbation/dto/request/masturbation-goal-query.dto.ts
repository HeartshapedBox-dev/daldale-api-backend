import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class MasturbationGoalQueryDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'clx1234567890',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '활성 목표만 조회할지 여부',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  activeOnly?: boolean;
}
