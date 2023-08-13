import { Logger } from '@nestjs/common';
import { IGameStatsProvider } from '../stats-provider.interface';
import * as ExternalAGameStats from './fixtures/external-a-game-stats.data';

/*
  Class responsible for providing game stats from 'External provider A'
*/
export class ExternalAGameStatsProvider implements IGameStatsProvider {
  private readonly logger = new Logger(ExternalAGameStatsProvider.name);

  async getStatsForGame<ExternalAGameStats>(gameIdentifier: string): Promise<ExternalAGameStats> {
    this.logger.debug(
      `Getting game stats from "External system A" for game with id ${gameIdentifier}`,
    );

    return ExternalAGameStats as ExternalAGameStats;
  }
}
