import { GAME_STATS_PROVIDER } from './game-stats-providers';

export const PLAYER_STAT_NAMES = [
  'rushAttempts',
  'rushTouchdowns',
  'rushYards',
  'receivingReceptions',
  'receivingYards',
];
export type PlayerStatNames = (typeof PLAYER_STAT_NAMES)[number];

export const TEAM_STAT_NAMES = [
  'rushAttempts',
  'rushTouchdowns',
  'rushYards',
  'receivingReceptions',
  'receivingYards',
];
export type TeamStatNames = (typeof TEAM_STAT_NAMES)[number];

export const GAME_STAT_NAMES = ['attendance'];
export type GameStatNames = (typeof GAME_STAT_NAMES)[number];

type BaseStatistic<StatNames extends string> = {
  statType: STAT_TYPE;
  sourceId: GAME_STATS_PROVIDER;
  gameId: string;
  stats: Record<StatNames, number | null>;
};

export enum STAT_TYPE {
  PLAYER = 'PLAYER',
  TEAM = 'TEAM',
  GAME = 'GAME',
}

export type PlayerStats = BaseStatistic<PlayerStatNames> & {
  playerId: string;
  teamId: string;
};

export type TeamStats = BaseStatistic<TeamStatNames> & {
  teamId: string;
};

export type GameStats = BaseStatistic<GameStatNames> & {
  homeTeamId: string;
  awayTeamId: string;
};

export const isGameStats = (obj: any): obj is GameStats => {
  return 'homeTeamId' in obj && 'awayTeamId' in obj;
};
export const isTeamStats = (obj: any): obj is TeamStats => {
  return 'teamId' in obj;
};
export const isPlayerStats = (obj: any): obj is PlayerStats => {
  return 'playerId' in obj && 'teamId' in obj;
};
