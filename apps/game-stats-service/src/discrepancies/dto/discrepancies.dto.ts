import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import {
  GameStatNames,
  TeamStatNames,
  PlayerStatNames,
  GameDiscrepancyMeta,
  TeamDiscrepancyMeta,
  PlayerDiscrepancyMeta,
  DiscrepancyValue,
  DISCREPANCIES_TYPE,
} from 'types';

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
