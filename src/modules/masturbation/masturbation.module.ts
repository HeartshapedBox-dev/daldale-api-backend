import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MasturbationController } from './masturbation.controller';
import { MasturbationRepository } from './masturbation.repository';
import { MasturbationService } from './masturbation.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MasturbationController],
  providers: [MasturbationService, MasturbationRepository],
})
export class MasturbationModule {}
