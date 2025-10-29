export interface TokenPayload {
  sub: string | number; // JWT 표준 필드 (subject) - 일반적으로 userId를 저장
  userId: string; // 사용자 ID (UUID) - 필수
  role?: string; // 사용자 역할 (USER, ADMIN 등) - 권한 체크용
  [key: string]: string | number | boolean | undefined;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
  