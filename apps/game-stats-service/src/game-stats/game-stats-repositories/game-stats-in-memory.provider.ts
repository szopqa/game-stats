import { GameStatsInMemoryRepository } from './game-stats-in-memory.repository';
import { GameStatsRepository } from './game-stats-repository.interface';

export const GameStatsInMemoryRepositoryProvider = {
  provide: GameStatsRepository,
  useFactory: () => {
    return new GameStatsInMemoryRepository();
  },
};
