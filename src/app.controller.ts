import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from './common/dto/response.dto';

@ApiTags('Health Check')
@Controller('api/v1')
export class AppController {
  constructor() {}
  /**
   * 백엔드 Health-Check용 API입니다.
   * 앞단(API Gateway, Load Balancer 등)으로부터 헬스 체크 요청을 받고 응답을 반환합니다.
   *
   * @tag Health Check
   */
  @ApiOperation({
    summary: '헬스 체크',
    description: '서버 연결 상태를 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '서비스가 정상적으로 동작 중입니다.',
    type: ResponseDto,
    schema: {
      example: {
        success: true,
        message: '서비스가 정상적으로 동작 중입니다.',
        data: {
          status: '200',
          endpoint: '/api/v1/health',
        },
        timestamp: '2025-10-24T12:00:00.000Z',
        path: '/api/v1/health',
        method: 'GET',
      },
    },
  })
  @Get('health')
  getHealth() {
    return {
      status: '200',
      endpoint: '/api/v1/health',
      message: '서비스가 정상적으로 동작 중입니다.',
    };
  }
}
