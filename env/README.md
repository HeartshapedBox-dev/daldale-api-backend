# Environment Configuration

## 환경별 설정 파일

### 1. **local.env** - 로컬 개발 환경
- 로컬 PostgreSQL 데이터베이스
- 디버그 로깅 레벨
- 개발용 JWT 시크릿

### 2. **development.env** - 개발 서버 환경
- 개발 서버 PostgreSQL 데이터베이스
- 정보 로깅 레벨
- 개발용 외부 서비스 설정

### 3. **production.env** - 프로덕션 환경
- 프로덕션 PostgreSQL 데이터베이스 (SSL)
- 경고 로깅 레벨
- 환경 변수로 보안 정보 관리

## 사용 방법

### 1. 환경 변수 설정
```bash
# 로컬 개발
export NODE_ENV=local

# 개발 서버
export NODE_ENV=development

# 프로덕션
export NODE_ENV=production
```

### 2. AppModule에서 사용
```typescript
import { EnvironmentModule } from './env/environment.module';

@Module({
  imports: [EnvironmentModule],
  // ...
})
export class AppModule {}
```

### 3. 서비스에서 사용
```typescript
import { EnvironmentConfigService } from './env/environment-config.service';

@Injectable()
export class SomeService {
  constructor(private envConfig: EnvironmentConfigService) {}
  
  someMethod() {
    const config = this.envConfig.appConfig;
    const dbUrl = config.database.url;
    const isProd = this.envConfig.isProduction;
  }
}
```

## 환경별 데이터베이스 URL 예시

- **Local**: `postgresql://postgres:password@localhost:5432/messenger_running_local`
- **Development**: `postgresql://dev_user:dev_password@dev-db-server:5432/messenger_running_dev`
- **Production**: `postgresql://prod_user:${DB_PASSWORD}@prod-db-server:5432/messenger_running_prod?sslmode=require`
