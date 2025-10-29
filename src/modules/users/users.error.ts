import { ErrorPreset } from 'src/common/decorators/error-response.decorator';

/**
 * Users 모듈 에러 프리셋
 */
export const UserErrorPresets: Record<string, ErrorPreset> = {
  ConflictEmailExists: {
    message: '이미 존재하는 이메일입니다.',
    error: 'CONFLICT',
    statusCode: 409,
  },
  BadRequest: {
    message: '잘못된 요청입니다.',
    error: 'BAD_REQUEST',
    statusCode: 400,
  },
} as const;

