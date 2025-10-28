import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../dto/response.dto';
import { Request } from 'express';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        // 이미 ResponseDto 형식인 경우 그대로 반환
        if (data instanceof ResponseDto) {
          return data;
        }

        // 기본 메시지 설정
        let message = '요청이 성공적으로 처리되었습니다.';
        if (typeof data === 'object' && data !== null && 'message' in data) {
          message = data.message;
          delete data.message;
        }

        // 자동으로 ResponseDto로 래핑
        return new ResponseDto(
          data,
          message,
          request.url,
          request.method,
        );
      }),
    );
  }
}

