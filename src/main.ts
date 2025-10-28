import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { EnvironmentConfigService } from '../env/environment-config.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 환경 설정 서비스 가져오기
  const envConfig = app.get(EnvironmentConfigService);
  const config = envConfig.appConfig;
  
  // 데이터베이스 연결 정보 로그 (보안을 위해 일부만 표시)
  if (config.database.url) {
    const dbInfo = config.database.url.replace(/\/\/.*@/, '//***:***@');
    logger.log(`🗄️  데이터베이스: ${dbInfo}`);
  } else {
    logger.warn('⚠️  DATABASE_URL이 설정되지 않았습니다!');
  }

  // Swagger 설정
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Daldale API')
    .setDescription('달달이 API 문서')
    .setVersion('1.0')
    .addTag('Daldale API')
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.port);
  
  logger.log(`✅ 서버가 http://localhost:${config.port} 에서 실행 중입니다`);
  logger.log(`📚 Swagger 문서: http://localhost:${config.port}/api/docs`);
}
bootstrap();
