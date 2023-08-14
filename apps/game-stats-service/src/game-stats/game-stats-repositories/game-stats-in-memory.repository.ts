import { Injectable, Logger } from '@nestjs/common';
import { IGameStatsRepository } from './game-stats-repository.interface';
import { GameStats, TeamStats, PlayerStats } from 'types';

@Injectable()
export class GameStatsInMemoryRepository implements IGameStatsRepository {
  private gameStatsStorage: Array<GameStats | TeamStats | PlayerStats> = [];
  private readonly logger = new Logger(GameStatsInMemoryRepository.name);

  async saveNewGameStatistic(gameStat: GameStats | TeamStats | PlayerStats): Promise<void> {
    this.logger.debug(
      `Saving game stat for game id ${gameStat.gameId} with type ${gameStat.statType} from source ${gameStat.sourceId}`,
    );
    this.gameStatsStorage.push(gameStat);
  }
}
