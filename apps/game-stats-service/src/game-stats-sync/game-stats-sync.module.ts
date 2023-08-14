import { Module } from '@nestjs/common';
import { GameStatsSyncService } from './game-stats-sync.service';
import { GameStatsRepository } from '../game-stats/game-stats-repositories/game-stats-repository.interface';
import { GameStatsInMemoryRepository } from '../game-stats/game-stats-repositories/game-stats-in-memory.repository';
import {
  GAMES_IDENTIFIERS,
  GAME_STATS_PROVIDERS,
  GameStatsProviders,
  GamesIdentifiers,
} from './game-stats-sync.config';
import { StatsProviderFactory } from './stats-provider.factory';

@Module({
  providers: [
    GameStatsSyncService,
    {
      provide: GameStatsRepository,
      useClass: GameStatsInMemoryRepository,
    },
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
})
export class GameStatsSyncModule {}
