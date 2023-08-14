import { Logger } from '@nestjs/common';
import { IGameStatsProvider } from '../stats-provider.interface';
import { externalAGameStats } from './fixtures/external-a-game-stats.data';
import { IGameStatsMappingStrategy } from '../../game-stats/mapping-strategies/game-stats-mapping-strategy.interface';
import ExternalAGameStatsMappingStrategy from '../../game-stats/mapping-strategies/external-a-mapping.strategy';
import { GameStats, TeamStats, PlayerStats, ExternalAGameStats } from 'types';

/*
  Class responsible for providing game stats from 'External provider A'
*/
export class ExternalAGameStatsProvider implements IGameStatsProvider<ExternalAGameStats> {
  gameStatsMappingStrategy: IGameStatsMappingStrategy<ExternalAGameStats> =
    new ExternalAGameStatsMappingStrategy();
  private readonly logger = new Logger(ExternalAGameStatsProvider.name);

  async getStatsForGame<ExternalAGameStats>(gameIdentifier: string): Promise<ExternalAGameStats> {
    this.logger.debug(
      `Getting game stats from "External system A" for game with id ${gameIdentifier}`,
    );

    return externalAGameStats as ExternalAGameStats;
  }

  getAllStatsFromGame(stats: ExternalAGameStats): Array<GameStats | TeamStats | PlayerStats> {
    const gameStats = this.gameStatsMappingStrategy.mapToGameStats(stats);
    const teamsStats = this.gameStatsMappingStrategy.mapToTeamsStats(stats);
    const playersStats = this.gameStatsMappingStrategy.mapToPlayersStats(stats);

    return [gameStats, ...teamsStats, ...playersStats];
  }
}
