import { GAME_STATS_PROVIDER } from 'types';

export const GAME_STATS_PROVIDERS = [
  GAME_STATS_PROVIDER.SPORT_RADAR,
  GAME_STATS_PROVIDER.EXTERNAL_A,
];
// for the MVP purpose hardcoded the value of the provided game stats file, but can accept any game identifiers
export const GAMES_IDENTIFIERS = ['15adf794-5630-4dc4-b0e7-f8d437b585b1'];

export const GameStatsProviders = Symbol('GameStatsProviders');
export const GamesIdentifiers = Symbol('GamesIdentifiers');
