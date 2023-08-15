import { GameStats, PlayerStats, TeamStats } from 'types';
import { GameStatsInMemoryRepository } from './game-stats-in-memory.repository';

// Used in unit tests to seed in memory db
export class MockedGameStatsInMemoryRepository extends GameStatsInMemoryRepository {
  constructor() {
    super();
  }

  seed(mockedData: Array<GameStats | TeamStats | PlayerStats>) {
    this.gameStatsStorage = [...mockedData];
  }
}
