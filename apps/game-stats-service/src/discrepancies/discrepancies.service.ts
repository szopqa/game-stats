import { Injectable } from '@nestjs/common';
import { GameStatsService } from '../game-stats/game-stats.service';
import {
  DiscrepancyValue,
  GAME_STAT_NAMES,
  GameDiscrepancyMeta,
  GameStats,
  PLAYER_STAT_NAMES,
  PlayerDiscrepancyMeta,
  PlayerStats,
  STAT_TYPE,
  TEAM_STAT_NAMES,
  TeamDiscrepancyMeta,
  TeamStats,
  isPlayerStats,
  isTeamStats,
} from 'types';
import { DiscrepancyDto } from './dto/discrepancies.dto';

type GetDiscrepanciesQuery = {
  gameId?: string;
};

@Injectable()
export class DiscrepanciesService {
  constructor(private readonly gameStatsService: GameStatsService) {}

  private composeDiscrepancyId(...parts: string[]) {
    return parts.join('__');
  }

  private areAllStatValuesEqual(values: Array<number | null>) {
    return new Set(values).size === 1;
  }

  groupStats<T extends PlayerStats | TeamStats | GameStats>(
    stats: T[],
  ): Record<string, Array<PlayerStats | TeamStats | GameStats>> {
    return stats.reduce((accumulator, val) => {
      let discrepancyId = '';

      if (isPlayerStats(val)) {
        discrepancyId = this.composeDiscrepancyId(
          val.gameId,
          val.statType,
          val.playerId,
          val.teamId,
        );
      } else if (isTeamStats(val)) {
        discrepancyId = this.composeDiscrepancyId(val.gameId, val.statType, val.teamId);
      } else if (val) {
        discrepancyId = this.composeDiscrepancyId(val.gameId, val.statType);
      }

      if (!accumulator[discrepancyId]) {
        accumulator[discrepancyId] = [];
      }
      accumulator[discrepancyId].push(val);
      return accumulator;
    }, {} as Record<string, Array<PlayerStats | TeamStats | GameStats>>);
  }

  discrepancyDtosFromGroupedStats(
    groupedStats: Record<string, Array<PlayerStats | TeamStats | GameStats>>,
    discrepancyType: STAT_TYPE,
  ): DiscrepancyDto[] {
    return Object.keys(groupedStats).reduce((accumulator, statsGroupId) => {
      const statsGroup: Array<PlayerStats | TeamStats | GameStats> = groupedStats[statsGroupId];
      const [groupElem] = statsGroup;
      const { gameId } = groupElem;

      let statNames;

      switch (discrepancyType) {
        case STAT_TYPE.GAME:
          statNames = GAME_STAT_NAMES;
          break;

        case STAT_TYPE.TEAM:
          statNames = TEAM_STAT_NAMES;
          break;

        case STAT_TYPE.PLAYER:
          statNames = PLAYER_STAT_NAMES;
          break;
      }

      for (const eachStatName of statNames) {
        const allStatValues = statsGroup.map(element => element.stats[eachStatName]);

        if (!this.areAllStatValuesEqual(allStatValues)) {
          let meta: GameDiscrepancyMeta | TeamDiscrepancyMeta | PlayerDiscrepancyMeta;

          if (isPlayerStats(groupElem)) {
            meta = {
              statType: STAT_TYPE.PLAYER,
              id: this.composeDiscrepancyId(statsGroupId, eachStatName),
              teamId: groupElem.teamId,
              playerId: groupElem.playerId,
              gameId,
            } as PlayerDiscrepancyMeta;
          } else if (isTeamStats(groupElem)) {
            meta = {
              statType: STAT_TYPE.TEAM,
              id: this.composeDiscrepancyId(statsGroupId, eachStatName),
              teamId: groupElem.teamId,
              gameId,
            } as TeamDiscrepancyMeta;
          } else {
            meta = {
              statType: STAT_TYPE.GAME,
              id: this.composeDiscrepancyId(statsGroupId, eachStatName),
              awayTeamId: groupElem.awayTeamId,
              homeTeamId: groupElem.homeTeamId,
              gameId: gameId,
            } as GameDiscrepancyMeta;
          }

          const values: DiscrepancyValue[] = statsGroup.map(element => ({
            sourceId: element.sourceId,
            value: element.stats[eachStatName],
          }));

          const discrepancy = new DiscrepancyDto(meta, eachStatName, values);
          accumulator.push(discrepancy);
        }
      }

      return accumulator;
    }, [] as DiscrepancyDto[]);
  }

  async getDiscrepancies(
    discrepancyType: STAT_TYPE,
    query?: GetDiscrepanciesQuery,
  ): Promise<DiscrepancyDto[]> {
    const stats = await this.gameStatsService.getStats(discrepancyType, query);
    const groupedStats = this.groupStats(stats);

    return this.discrepancyDtosFromGroupedStats(groupedStats, discrepancyType);
  }

  async getAllDiscrepancies(query?: GetDiscrepanciesQuery): Promise<DiscrepancyDto[]> {
    return (
      await Promise.all(
        Object.values(STAT_TYPE).map(statType => this.getDiscrepancies(statType, query)),
      )
    ).flat();
  }
}
