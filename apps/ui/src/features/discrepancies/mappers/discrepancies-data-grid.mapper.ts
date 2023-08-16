import { GameDiscrepancy, TeamDiscrepancy, PlayerDiscrepancy } from 'types';

export type DiscrepancyRow = {
  id: number;
  sourceId: string;
  value: number | null;
  statType: string;
  statName: string;
  gameId: string;
  discrepancyId: string;
  teamId?: string;
  playerId?: string;
};

export const toBaseRows = (
  discrepancies: PlayerDiscrepancy[] | GameDiscrepancy[] | TeamDiscrepancy[],
) => {
  let entityCounter = 0;
  const rows: DiscrepancyRow[] = [];

  discrepancies.forEach(discrepancy => {
    const discrepancyBase = {
      statType: discrepancy.meta.statType,
      statName: discrepancy.statName,
      gameId: discrepancy.meta.gameId,
      discrepancyId: discrepancy.meta.id,
    };
    const { values } = discrepancy;

    values.forEach(value => {
      rows.push({
        ...discrepancyBase,
        id: ++entityCounter,
        sourceId: value.sourceId,
        value: value.value,
      });
    });
  });

  return rows;
};

export const toTeamRows = (discrepancies: TeamDiscrepancy[]): DiscrepancyRow[] => {
  const baseRows = toBaseRows(discrepancies);

  return baseRows.map(row => {
    const teamId = discrepancies.find(elem => elem.meta.id === row.discrepancyId)?.meta.teamId;

    return {
      ...row,
      teamId: teamId ?? '',
    };
  });
};

export const toPlayerRows = (discrepancies: PlayerDiscrepancy[]): DiscrepancyRow[] => {
  const baseRows = toBaseRows(discrepancies);

  return baseRows.map(row => {
    const meta = discrepancies.find(elem => elem.meta.id === row.discrepancyId)?.meta;
    const teamId = meta?.teamId;
    const playerId = meta?.playerId;

    return {
      ...row,
      teamId: teamId ?? '',
      playerId: playerId ?? '',
    };
  });
};

export const toAllDiscrepancies = (
  discrepancies: (TeamDiscrepancy | GameDiscrepancy | PlayerDiscrepancy)[],
): DiscrepancyRow[] => {
  return discrepancies
    .reduce((rows: DiscrepancyRow[], discrepancy) => {
      switch (discrepancy.meta.statType) {
        // TODO: fix issue with DISCREPANCIES_TYPE enum import and replace magic strings
        case 'PLAYER':
          rows.push(...toPlayerRows([discrepancy as PlayerDiscrepancy]));
          break;

        case 'TEAM':
          rows.push(...toTeamRows([discrepancy as TeamDiscrepancy]));
          break;

        default:
          rows.push(...toBaseRows([discrepancy as GameDiscrepancy]));
          break;
      }

      return rows;
    }, [])
    .map((row, id) => ({
      ...row,
      id: id + 1,
    }));
};
