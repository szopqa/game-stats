import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameStatsSyncModule } from './game-stats-sync/game-stats-sync.module';
import { GameStatsModule } from './game-stats/game-stats.module';

@Module({
  imports: [GameStatsSyncModule, GameStatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
