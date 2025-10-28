import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let error = 'INTERNAL_SERVER_ERROR';

    // HttpException인 경우 메시지 추출
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || 'HTTP_EXCEPTION';
      } else {
        message = exception.message;
        error = 'HTTP_EXCEPTION';
      }
    }

    // 일관된 에러 응답 형식 (messenger 형식 유지)
    const errorResponse = new ErrorResponseDto(
      message,
      error,
      status,
      request.url,
      request.method,
    );

    response.status(status).json(errorResponse);
  }
} 