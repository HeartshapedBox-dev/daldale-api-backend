import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config.interface';

@Injectable()
export class EnvironmentConfigService {
  constructor(private configService: ConfigService) {}

  get appConfig(): AppConfig {
    return {
      nodeEnv: this.configService.get<string>('NODE_ENV', 'local'),
      port: this.configService.get<number>('PORT', 3000),
      database: {
        url: this.configService.get<string>('DATABASE_URL') || '',
        ssl: this.configService.get<string>('NODE_ENV') === 'production',
      },
      jwt: {
        accessToken: {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') || '',
          expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN', '15m'),
        },
        refreshToken: {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') || '',
          expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN', '7d'),
        },
      },
      api: {
        prefix: this.configService.get<string>('API_PREFIX', 'api/v1'),
        corsOrigin: this.configService.get<string>('CORS_ORIGIN') || '',
      },
      logging: {
        level: this.configService.get<string>('LOG_LEVEL', 'info'),
      },
      security: {
        bcryptRounds: this.configService.get<number>('BCRYPT_ROUNDS', 10),
        rateLimitTtl: this.configService.get<number>('RATE_LIMIT_TTL', 60),
        rateLimitLimit: this.configService.get<number>('RATE_LIMIT_LIMIT', 100),
      },
      externalServices: {
        redisUrl: this.configService.get<string>('REDIS_URL'),
        awsRegion: this.configService.get<string>('AWS_REGION'),
        awsAccessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        awsSecretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    };
  }

  get isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  get isDevelopment(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'development';
  }

  get isLocal(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'local';
  }
}
