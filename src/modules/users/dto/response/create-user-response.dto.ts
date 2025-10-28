import { ApiProperty } from '@nestjs/swagger';
import { Gender, UserRole } from '../../enum/user.enum';

export class CreateUserResponseDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'clx1234567890',
  })
  id: string;

  @ApiProperty({
    description: '이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '이름',
    example: '홍길동',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: '사용자 역할',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: '성별',
    enum: Gender,
    example: Gender.MALE,
    required: false,
  })
  gender?: Gender;

  @ApiProperty({
    description: '생년월일',
    example: '1990-01-01T00:00:00.000Z',
    required: false,
  })
  birthDate?: Date;

  @ApiProperty({
    description: '생성일',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

