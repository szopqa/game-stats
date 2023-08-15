import { STAT_TYPE } from './game-stats.types';

export type BaseDiscrepancyMeta = {
  id: string;
  gameId: string;
  statType: STAT_TYPE;
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
