import { Inject, Injectable } from '@nestjs/common';
import {
  GameStatsRepository,
  IGameStatsRepository,
} from '../game-stats/game-stats-repositories/game-stats-repository.interface';
import { GameStats, PlayerStats, STAT_TYPE, TeamStats } from 'types';

type GetDiscrepanciesQuery = {
  gameId?: string;
};

@Injectable()
export class GameStatsService {
  constructor(
    @Inject(GameStatsRepository) private readonly gameStatsRepository: IGameStatsRepository,
  ) {}

  private async getStatsForGame(
    gameStatType: STAT_TYPE,
    gameId: string,
  ): Promise<PlayerStats[] | TeamStats[] | GameStats[]> {
    let stats;
    switch (gameStatType) {
      case STAT_TYPE.GAME:
        stats = await this.gameStatsRepository.getGameStatsForGame(gameId);
        break;

      case STAT_TYPE.TEAM:
        stats = await this.gameStatsRepository.getTeamsStatsForGame(gameId);
        break;

      case STAT_TYPE.PLAYER:
        stats = await this.gameStatsRepository.getPlayersStatsForGame(gameId);
        break;
    }

    if (!stats || !stats.length) {
      // TODO: handle the error better (e.g. via the interceptor)
      throw new Error(`Unable to find stats of type ${gameStatType} for game with id ${gameId}`);
    }

    return stats;
  }

  async getStats(
    gameStatType: STAT_TYPE,
    query?: GetDiscrepanciesQuery,
  ): Promise<Array<PlayerStats | TeamStats | GameStats>> {
    const { gameId } = query || {};

    if (gameId) {
      return await this.getStatsForGame(gameStatType, gameId);
    }

    const allGameIds = await this.gameStatsRepository.getAllGameIds();

    return (
      await Promise.all(allGameIds.map(gameId => this.getStatsForGame(gameStatType, gameId)))
    ).flat();
  }

  async getAllStats(
    query?: GetDiscrepanciesQuery,
  ): Promise<Array<PlayerStats | TeamStats | GameStats>> {
    return (
      await Promise.all(Object.values(STAT_TYPE).map(statType => this.getStats(statType, query)))
    ).flat();
  }
}
