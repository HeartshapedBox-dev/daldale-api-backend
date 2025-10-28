import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: '에러 발생 여부',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: '에러 메시지',
    example: '요청을 처리하는 중 오류가 발생했습니다.',
    examples: {
      '400': '잘못된 요청입니다.',
      '401': '인증이 필요합니다.',
      '403': '접근이 거부되었습니다.',
      '404': '요청한 리소스를 찾을 수 없습니다.',
      '409': '이미 존재하는 리소스입니다.',
      '500': '서버 내부 오류가 발생했습니다.',
    },
  })
  message: string;

  @ApiProperty({
    description: '에러 코드',
    example: 'INTERNAL_SERVER_ERROR',
    examples: {
      '400': 'BAD_REQUEST',
      '401': 'UNAUTHORIZED',
      '403': 'FORBIDDEN',
      '404': 'NOT_FOUND',
      '409': 'CONFLICT',
      '500': 'INTERNAL_SERVER_ERROR',
    },
  })
  error: string;

  @ApiProperty({
    description: 'HTTP 상태 코드',
    example: 500,
    examples: {
      '400': 400,
      '401': 401,
      '403': 403,
      '404': 404,
      '409': 409,
      '500': 500,
    },
  })
  statusCode: number;

  @ApiProperty({
    description: '에러 발생 시간',
    example: '2024-03-21T12:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: '요청 경로',
    example: '/api/v1/endpoint',
  })
  path: string;

  @ApiProperty({
    description: 'HTTP 메서드',
  })
  method: string;

  constructor(
    message: string,
    error: string,
    statusCode: number,
    path: string,
    method: string,
  ) {
    this.success = false;
    this.message = message;
    this.error = error;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.path = path;
    this.method = method;
  }
} 