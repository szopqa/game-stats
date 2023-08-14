import { ExternalAGameStats } from './external-a-stats.types';
import { SportRadarGameStats } from './sport-radar-stats.types';

export enum GAME_STATS_PROVIDER {
  EXTERNAL_A = 'external',
  SPORT_RADAR = 'sr',
}

export * from './external-a-stats.types';
export * from './sport-radar-stats.types';

export type ExternalProvidersGameStats = ExternalAGameStats | SportRadarGameStats;
