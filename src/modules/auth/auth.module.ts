import { Module } from '@nestjs/common';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [JwtModule],
  providers: [],
  exports: [JwtModule],
})
export class AuthModule {}

