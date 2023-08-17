import { useEffect, useState } from 'react';
import { DiscrepancyRow } from '../mappers/discrepancies-data-grid.mapper';
import { GameDiscrepancy, PlayerDiscrepancy, TeamDiscrepancy } from 'types';

export const useDiscrepanciesIgnore = <
  T extends TeamDiscrepancy | GameDiscrepancy | PlayerDiscrepancy,
>(
  discrepancies: T[] | undefined,
  rowMapper: (arg: T[]) => DiscrepancyRow[],
) => {
  const [discrepanciesToShow, setDiscrepanciesToShow] = useState<DiscrepancyRow[]>([]);

  useEffect(() => {
    if (discrepancies) {
      setDiscrepanciesToShow(rowMapper(discrepancies));
    }
  }, [discrepancies, rowMapper]);

  const [ignoreSelectedIds, setIgnoreSelectedIds] = useState<number[]>([]);

  const handleIgnore = () => {
    setDiscrepanciesToShow(
      discrepanciesToShow.filter(discrepancy => !ignoreSelectedIds.includes(discrepancy.id)),
    );
  };

  return {
    setIgnoreSelectedIds,
    handleIgnore,
    discrepanciesToShow,
  };
};
