import { Injectable, Logger } from '@nestjs/common';
import { IGameStatsRepository } from './game-stats-repository.interface';
import { GameStats, TeamStats, PlayerStats, STAT_TYPE } from 'types';
import { uniq } from 'lodash';

@Injectable()
export class GameStatsInMemoryRepository implements IGameStatsRepository {
  protected gameStatsStorage: Array<GameStats | TeamStats | PlayerStats> = [];

  private readonly logger = new Logger(GameStatsInMemoryRepository.name);

  async saveNewGameStatistic(gameStat: GameStats | TeamStats | PlayerStats): Promise<void> {
    this.logger.debug(
      `Saving game stat for game id ${gameStat.gameId} with type ${gameStat.statType} from source ${gameStat.sourceId}`,
    );
    this.gameStatsStorage.push(gameStat);
  }

  async getGameStatsForGame(gameId: string): Promise<GameStats[]> {
    this.logger.debug(`Getting game stats for game id ${gameId}`);

    return this.gameStatsStorage.filter(
      stats => stats.statType === STAT_TYPE.GAME && stats.gameId === gameId,
    ) as Array<GameStats>;
  }

  async getTeamsStatsForGame(gameId: string): Promise<TeamStats[]> {
    this.logger.debug(`Getting teams stats for game id ${gameId}`);

    return this.gameStatsStorage.filter(
      stats => stats.statType === STAT_TYPE.TEAM && stats.gameId === gameId,
    ) as Array<TeamStats>;
  }

  async getPlayersStatsForGame(gameId: string): Promise<PlayerStats[]> {
    this.logger.debug(`Getting players stats for game id ${gameId}`);

    return this.gameStatsStorage.filter(
      stats => stats.statType === STAT_TYPE.PLAYER && stats.gameId === gameId,
    ) as Array<PlayerStats>;
  }

  async getAllGameIds(): Promise<string[]> {
    return uniq(this.gameStatsStorage.map(stat => stat.gameId));
  }
}
