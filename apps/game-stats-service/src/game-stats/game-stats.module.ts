import { Module } from '@nestjs/common';
import { GameStatsRepository } from './game-stats-repositories/game-stats-repository.interface';
import { GameStatsInMemoryRepositoryProvider } from './game-stats-repositories/game-stats-in-memory.provider';
import { GameStatsService } from './game-stats.service';

@Module({
  providers: [GameStatsInMemoryRepositoryProvider, GameStatsService],
  exports: [GameStatsRepository, GameStatsService],
})
export class GameStatsModule {}
