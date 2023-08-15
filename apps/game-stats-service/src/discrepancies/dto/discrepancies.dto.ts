import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import {
  STAT_TYPE,
  GameStatNames,
  TeamStatNames,
  PlayerStatNames,
  GameDiscrepancyMeta,
  TeamDiscrepancyMeta,
  PlayerDiscrepancyMeta,
  DiscrepancyValue,
} from 'types';

export enum DISCREPANCIES_TYPE {
  PLAYER = STAT_TYPE.PLAYER,
  TEAM = STAT_TYPE.TEAM,
  GAME = STAT_TYPE.GAME,
  ALL = 'ALL',
}

export class DiscrepanciesQueryDto {
  @ApiPropertyOptional({ default: 'ALL' })
  @IsIn(Object.values(DISCREPANCIES_TYPE))
  @IsOptional()
  readonly type?: DISCREPANCIES_TYPE;
}

export class DiscrepancyDto {
  meta: GameDiscrepancyMeta | TeamDiscrepancyMeta | PlayerDiscrepancyMeta;
  statName: PlayerStatNames | TeamStatNames | GameStatNames;
  values: Array<DiscrepancyValue>;

  constructor(
    meta: GameDiscrepancyMeta | TeamDiscrepancyMeta | PlayerDiscrepancyMeta,
    statName: PlayerStatNames | TeamStatNames | GameStatNames,
    values: Array<DiscrepancyValue>,
  ) {
    this.meta = meta;
    this.statName = statName;
    this.values = values;
  }
}
