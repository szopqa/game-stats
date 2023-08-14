import { Module } from '@nestjs/common';
import { GameStatsInMemoryRepository } from './game-stats-repositories/game-stats-in-memory.repository';

@Module({
  providers: [GameStatsInMemoryRepository],
})
export class GameStatsModule {}
