import { GameStatNames, PlayerStatNames, STAT_TYPE, TeamStatNames } from './game-stats.types';

export enum DISCREPANCIES_TYPE {
  PLAYER = STAT_TYPE.PLAYER,
  TEAM = STAT_TYPE.TEAM,
  GAME = STAT_TYPE.GAME,
  ALL = 'ALL',
}

export type BaseDiscrepancyMeta = {
  id: string;
  gameId: string;
  statType: STAT_TYPE | string;
};

export type GameDiscrepancyMeta = BaseDiscrepancyMeta & {
  homeTeamId: string;
  awayTeamId: string;
};

export type TeamDiscrepancyMeta = BaseDiscrepancyMeta & {
  teamId: string;
};

export type PlayerDiscrepancyMeta = BaseDiscrepancyMeta & {
  teamId: string;
  gameId: string;
  playerId: string;
};

export type DiscrepancyValue = {
  sourceId: string;
  value: number | null;
};

export type Discrepancy = {
  meta: GameDiscrepancyMeta | TeamDiscrepancyMeta | PlayerDiscrepancyMeta;
  statName: PlayerStatNames | TeamStatNames | GameStatNames;
  values: Array<DiscrepancyValue>;
};

export type TeamDiscrepancy = {
  meta: TeamDiscrepancyMeta;
  statName: TeamStatNames;
  values: Array<DiscrepancyValue>;
};

export type GameDiscrepancy = {
  meta: GameDiscrepancyMeta;
  statName: GameStatNames;
  values: Array<DiscrepancyValue>;
};

export type PlayerDiscrepancy = {
  meta: PlayerDiscrepancyMeta;
  statName: PlayerStatNames;
  values: Array<DiscrepancyValue>;
};
