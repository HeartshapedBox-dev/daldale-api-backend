import { getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';

/**
 * 에러 프리셋 타입 정의
 */
export interface ErrorPreset {
  message: string;
  error: string;
  statusCode: number;
}

/**
 * 에러 응답 스와거 스키마 생성 헬퍼
 * @param preset - 에러 프리셋
 * @param path - 요청 경로
 * @param method - HTTP 메서드
 * @returns 스와거 스키마 객체
 */
export function makeErrorApiResponseSchema(
  preset: ErrorPreset,
  path: string,
  method: string,
) {
  return {
    allOf: [
      { $ref: getSchemaPath(ErrorResponseDto) },
      {
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: preset.message,
          },
          error: {
            type: 'string',
            example: preset.error,
          },
          statusCode: {
            type: 'number',
            example: preset.statusCode,
          },
          timestamp: {
            type: 'string',
            example: new Date().toISOString(),
          },
          path: {
            type: 'string',
            example: path,
          },
          method: {
            type: 'string',
            example: method,
          },
        },
      },
    ],
  };
}

/**
 * 런타임 에러 응답 생성 헬퍼
 * @param preset - 에러 프리셋
 * @param path - 요청 경로
 * @param method - HTTP 메서드
 * @returns ErrorResponseDto 인스턴스
 */
export function buildErrorResponse(
  preset: ErrorPreset,
  path: string,
  method: string,
): ErrorResponseDto {
  return new ErrorResponseDto(
    preset.message,
    preset.error,
    preset.statusCode,
    path,
    method,
  );
}

