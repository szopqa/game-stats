import { Logger } from '@nestjs/common';
import { IGameStatsProvider } from '../stats-provider.interface';
import * as SportRadarGameStats from './fixtures/sport-radar-game-stats.data';

/*
  Class responsible for providing game stats from 'Sport radar' system
*/
export class SportRadarStatsProvider implements IGameStatsProvider {
  private readonly logger = new Logger(SportRadarStatsProvider.name);

  async getStatsForGame<SportRadarGameStats>(gameIdentifier: string): Promise<SportRadarGameStats> {
    this.logger.debug(
      `Getting game stats from "Sport radar system" for game with id ${gameIdentifier}`,
    );

    return SportRadarGameStats as SportRadarGameStats;
  }
}
