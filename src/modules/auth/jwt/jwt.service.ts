import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { EnvironmentConfigService } from 'env/environment-config.service';
import { TokenPayload, TokenPair } from './interfaces/token.interface';

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: EnvironmentConfigService,
  ) {}

  /**
   * 액세스 토큰과 리프레시 토큰 쌍 생성
   */
  async generateTokenPair(payload: TokenPayload): Promise<TokenPair> {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 액세스 토큰 생성
   */
  async generateAccessToken(payload: TokenPayload): Promise<string> {
    const config = this.configService.appConfig.jwt.accessToken;
    
    // JwtService.signAsync는 secret을 options로 받을 수 있음
    const options = {
      secret: config.secret,
      expiresIn: config.expiresIn,
    };
    
    return this.jwtService.signAsync(payload, options as Parameters<NestJwtService['signAsync']>[1]);
  }

  /**
   * 리프레시 토큰 생성
   */
  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    const config = this.configService.appConfig.jwt.refreshToken;

    const options = {
      secret: config.secret,
      expiresIn: config.expiresIn,
    };

    return this.jwtService.signAsync(payload, options as Parameters<NestJwtService['signAsync']>[1]);
  }

  /**
   * 액세스 토큰 검증
   */
  async verifyAccessToken(token: string): Promise<TokenPayload> {
    const config = this.configService.appConfig.jwt.accessToken;

    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: config.secret,
      });
    } catch (error) {
      throw new UnauthorizedException('액세스 토큰이 유효하지 않습니다.');
    }
  }

  /**
   * 리프레시 토큰 검증
   */
  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    const config = this.configService.appConfig.jwt.refreshToken;

    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: config.secret,
      });
    } catch (error) {
      throw new UnauthorizedException('리프레시 토큰이 유효하지 않습니다.');
    }
  }

  /**
   * 리프레시 토큰으로 새로운 액세스 토큰 생성
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    const payload = await this.verifyRefreshToken(refreshToken);
    return this.generateAccessToken(payload);
  }

  /**
   * 토큰에서 페이로드 추출 (검증 없이)
   */
  decodeToken<T = TokenPayload>(token: string): T {
    return this.jwtService.decode(token) as T;
  }

  /**
   * 토큰에서 userId 추출 (편의 메서드)
   */
  getUserIdFromToken(token: string): string {
    const payload = this.decodeToken<TokenPayload>(token);
    return payload.userId || payload.sub?.toString() || '';
  }

  /**
   * 토큰에서 사용자 정보 추출 (검증 후)
   */
  async extractUserFromToken(token: string): Promise<TokenPayload> {
    return this.verifyAccessToken(token);
  }
}

