import { PlayerStats, TeamStats, GameStats } from 'types';

export interface IGameStatsRepository {
  saveNewGameStatistic(gameStat: GameStats | TeamStats | PlayerStats): Promise<void>;
}
export const GameStatsRepository = Symbol('IGameStatsRepository');
