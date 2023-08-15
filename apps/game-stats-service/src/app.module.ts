import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GameStatsSyncModule } from './game-stats-sync/game-stats-sync.module';
import { GameStatsModule } from './game-stats/game-stats.module';
import { DiscrepanciesModule } from './discrepancies/discrepancies.module';

@Module({
  imports: [GameStatsSyncModule, GameStatsModule, DiscrepanciesModule],
  controllers: [AppController],
})
export class AppModule {}
