import { PlayerStats, TeamStats, GameStats } from 'types';

export interface IGameStatsRepository {
  saveNewGameStatistic(gameStat: GameStats | TeamStats | PlayerStats): Promise<void>;

  getGameStatsForGame(gameId: string): Promise<Array<GameStats>>;
  getTeamsStatsForGame(gameId: string): Promise<Array<TeamStats>>;
  getPlayersStatsForGame(gameId: string): Promise<Array<PlayerStats>>;

  getAllGameIds(): Promise<string[]>;
}

export const GameStatsRepository = Symbol('IGameStatsRepository');
