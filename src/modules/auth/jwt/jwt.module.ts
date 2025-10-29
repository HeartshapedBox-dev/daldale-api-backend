import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { AuthJwtService } from './jwt.service';
import { EnvironmentConfigService } from 'env/environment-config.service';
import { EnvironmentModule } from 'env/environment.module';

@Module({
  imports: [
    ConfigModule,
    EnvironmentModule,
    NestJwtModule.registerAsync({
      imports: [ConfigModule, EnvironmentModule],
      inject: [EnvironmentConfigService],
      useFactory: (configService: EnvironmentConfigService): JwtModuleOptions => {
        const config = configService.appConfig.jwt.accessToken;
        return {
          secret: config.secret,
          signOptions: {
            expiresIn: config.expiresIn,
          } as jwt.SignOptions,
        };
      },
    }),
  ],
  providers: [AuthJwtService],
  exports: [AuthJwtService, NestJwtModule],
})
export class JwtModule {}

