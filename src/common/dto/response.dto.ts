import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({
    description: '응답 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '요청이 성공적으로 처리되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
  })
  data: T;

  @ApiProperty({
    description: '응답 시간',
  })
  timestamp: string;

  @ApiProperty({
    description: '요청한 엔드포인트',
  })
  path: string;

  @ApiProperty({
    description: 'HTTP 메서드',
  })
  method: string;

  constructor(
    data: T,
    message = '요청이 성공적으로 처리되었습니다.',
    path: string,
    method: string,
  ) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.path = path;
    this.method = method;
  }
}
