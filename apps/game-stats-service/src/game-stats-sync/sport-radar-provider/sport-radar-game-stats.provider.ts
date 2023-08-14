import { Logger } from '@nestjs/common';
import { IGameStatsProvider } from '../stats-provider.interface';
import { sportRadarGameStats } from './fixtures/sport-radar-game-stats.data';
import { IGameStatsMappingStrategy } from '../../game-stats/mapping-strategies/game-stats-mapping-strategy.interface';
import { SportRadarGameStats } from 'types';
import SportRadarGameStatsMappingStrategy from '../../game-stats/mapping-strategies/sport-radar-mapping.strategy';
import { GameStats, TeamStats, PlayerStats } from 'types';

/*
  Class responsible for providing game stats from 'Sport radar' system
*/
export class SportRadarStatsProvider implements IGameStatsProvider<SportRadarGameStats> {
  gameStatsMappingStrategy: IGameStatsMappingStrategy<SportRadarGameStats> =
    new SportRadarGameStatsMappingStrategy();
  private readonly logger = new Logger(SportRadarStatsProvider.name);

  async getStatsForGame<SportRadarGameStats>(gameIdentifier: string): Promise<SportRadarGameStats> {
    this.logger.debug(
      `Getting game stats from "Sport radar system" for game with id ${gameIdentifier}`,
    );

    return sportRadarGameStats as SportRadarGameStats;
  }

  getAllStatsFromGame(stats: SportRadarGameStats): Array<GameStats | TeamStats | PlayerStats> {
    const gameStats = this.gameStatsMappingStrategy.mapToGameStats(stats);
    const teamsStats = this.gameStatsMappingStrategy.mapToTeamsStats(stats);
    const playersStats = this.gameStatsMappingStrategy.mapToPlayersStats(stats);

    return [gameStats, ...teamsStats, ...playersStats];
  }
}
