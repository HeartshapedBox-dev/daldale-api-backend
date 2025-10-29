export interface DatabaseConfig {
  url: string;
  ssl?: boolean;
}

export interface JwtTokenConfig {
  secret: string;
  expiresIn: string;
}

export interface JwtConfig {
  accessToken: JwtTokenConfig;
  refreshToken: JwtTokenConfig;
}

export interface ApiConfig {
  prefix: string;
  corsOrigin: string;
}

export interface LoggingConfig {
  level: string;
}

export interface SecurityConfig {
  bcryptRounds: number;
  rateLimitTtl: number;
  rateLimitLimit: number;
}

export interface ExternalServicesConfig {
  redisUrl?: string;
  awsRegion?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
}

export interface AppConfig {
  nodeEnv: string;
  port: number;
  database: DatabaseConfig;
  jwt: JwtConfig;
  api: ApiConfig;
  logging: LoggingConfig;
  security: SecurityConfig;
  externalServices: ExternalServicesConfig;
}
