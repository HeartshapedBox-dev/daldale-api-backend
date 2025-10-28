import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({
    description: 'Google ID 토큰',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiYzM...',
  })
  @IsString({ message: 'ID 토큰은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: 'ID 토큰은 필수입니다.' })
  idToken: string;

  @ApiProperty({
    description: 'Google 액세스 토큰',
    example: 'ya29.a0AfH6SMC...',
  })
  @IsString({ message: '액세스 토큰은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '액세스 토큰은 필수입니다.' })
  accessToken: string;
} 