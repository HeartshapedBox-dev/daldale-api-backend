import { ApiProperty } from '@nestjs/swagger';
import { Gender, UserRole } from '../../enum/user.enum';

export class TokenResponseDto {
  @ApiProperty({
    description: '액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: '리프레시 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

export class UserProfileResponseDto {
  @ApiProperty({
    description: '프로필 ID',
    example: 'clx1234567890',
  })
  id: string;

  @ApiProperty({
    description: '키 (cm)',
    example: 175.5,
    required: false,
  })
  height?: number;

  @ApiProperty({
    description: '몸무게 (kg)',
    example: 70.5,
    required: false,
  })
  weight?: number;

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

export class MasturbationWeekResponseDto {
  @ApiProperty({
    description: 'ID',
    example: 'clx1234567890',
  })
  id: string;

  @ApiProperty({
    description: '주간 자위 횟수',
    example: 3,
  })
  count: number;

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
    required: true,
  })
  name?: string;

  @ApiProperty({
    description: '사용자 역할',
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: '성별',
    enum: Gender,
    example: Gender.MALE,
  })
  gender: Gender;

  @ApiProperty({
    description: '생년월일',
    example: '1990-01-01T00:00:00.000Z',
    required: true,
  })
  birthDate: Date;

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

  @ApiProperty({
    description: '사용자 프로필',
    type: UserProfileResponseDto,
    required: true,
  })
  profile: UserProfileResponseDto;

  @ApiProperty({
    description: '주간 자위 횟수 목록',
    type: [MasturbationWeekResponseDto],
    required: true,
  })
  masturbationWeeks: MasturbationWeekResponseDto[];

  @ApiProperty({
    description: '토큰 정보',
    type: TokenResponseDto,
  })
  tokens: TokenResponseDto;
}

export type CreateUserResponse = CreateUserResponseDto;

