import {
  ExternalProvidersGameStats,
  GAME_STATS_PROVIDER,
  GameStats,
  PlayerStats,
  TeamStats,
} from 'types';

export interface IGameStatsMappingStrategy<T extends ExternalProvidersGameStats> {
  readonly statSourceId: GAME_STATS_PROVIDER;

  mapToGameStats(gameStats: T): GameStats;
  mapToTeamsStats(gameStats: T): TeamStats[];
  mapToPlayersStats(gameStats: T): PlayerStats[];
}
