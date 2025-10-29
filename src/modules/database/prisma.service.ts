import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EnvironmentConfigService } from '../../../env/environment-config.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: EnvironmentConfigService) {
    super({
      datasources: {
        db: {
          url: configService.appConfig.database.url,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
