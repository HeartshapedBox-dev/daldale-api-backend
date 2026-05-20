import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MasturbationUserQueryDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'clx1234567890',
  })
  @IsString()
  userId: string;
}
