import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginResponseDto {
  @ApiProperty({
    description: '사용자 정보',
    example: {
      id: 'google_user_id',
      email: 'user@example.com',
      name: 'Google User',
      picture: 'https://example.com/picture.jpg'
    }
  })
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };

  @ApiProperty({
    description: 'JWT 토큰 정보',
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      expiresIn: 3600
    }
  })
  token: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
} 