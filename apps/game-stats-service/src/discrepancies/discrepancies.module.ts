import { Module } from '@nestjs/common';
import { DiscrepanciesService } from './discrepancies.service';
import { DiscrepanciesController } from './api/discrepancies.controller';
import { GameStatsModule } from '../game-stats/game-stats.module';

@Module({
  providers: [DiscrepanciesService],
  controllers: [DiscrepanciesController],
  imports: [GameStatsModule],
})
export class DiscrepanciesModule {}
