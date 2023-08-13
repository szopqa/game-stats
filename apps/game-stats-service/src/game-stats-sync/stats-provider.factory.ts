import { GAME_STATS_PROVIDER } from 'types';
import { ExternalAGameStatsProvider } from './external-A-provider/external-a-game-stats.provider';
import { SportRadarStatsProvider } from './sport-radar-provider/sport-radar-game-stats.provider';
import { IGameStatsProvider } from './stats-provider.interface';

export class StatsProviderFactory {
  static createProvider(provider: GAME_STATS_PROVIDER): IGameStatsProvider {
    switch (provider) {
      case GAME_STATS_PROVIDER.EXTERNAL_A:
        return new ExternalAGameStatsProvider();

      case GAME_STATS_PROVIDER.SPORT_RADAR:
        return new SportRadarStatsProvider();

      default:
        throw new Error(`Specified provider ${provider} does not exist`);
    }
  }
}
