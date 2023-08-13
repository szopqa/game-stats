import { GAME_STATS_PROVIDER } from './game-stats-providers';

type PlayerStatNames =
  | 'rushAttempts'
  | 'rushTouchdowns'
  | 'rushYards'
  | 'receivingReceptions'
  | 'receivingYards';

type TeamStatNames =
  | 'rushAttempts'
  | 'rushTouchdowns'
  | 'rushYards'
  | 'receivingReceptions'
  | 'receivingYards';

type GameStatNames = 'attendance';

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
