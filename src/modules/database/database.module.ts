import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EnvironmentModule } from '../../../env/environment.module';

@Global()
@Module({
  imports: [EnvironmentModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
