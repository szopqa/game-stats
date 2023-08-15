import { Module } from '@nestjs/common';
import { GameStatsSyncService } from './game-stats-sync.service';
import {
  GAMES_IDENTIFIERS,
  GAME_STATS_PROVIDERS,
  GameStatsProviders,
  GamesIdentifiers,
} from './game-stats-sync.config';
import { StatsProviderFactory } from './stats-provider.factory';
import { GameStatsModule } from '../game-stats/game-stats.module';

@Module({
  providers: [
    GameStatsSyncService,
    {
      provide: GameStatsProviders,
      useValue: GAME_STATS_PROVIDERS,
    },
    {
      provide: GamesIdentifiers,
      useValue: GAMES_IDENTIFIERS,
    },
    StatsProviderFactory,
  ],
  imports: [GameStatsModule],
})
export class GameStatsSyncModule {}
