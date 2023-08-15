import { IGameStatsMappingStrategy } from '../game-stats/mapping-strategies/game-stats-mapping-strategy.interface';
import { ExternalProvidersGameStats, GameStats, PlayerStats, TeamStats } from 'types';

export interface IGameStatsProvider<T extends ExternalProvidersGameStats> {
  gameStatsMappingStrategy: IGameStatsMappingStrategy<T>;

  getStatsForGame(gameIdentifier: string): Promise<T>;
  getAllStatsFromGame(stats: T): Array<GameStats | TeamStats | PlayerStats>;
}
