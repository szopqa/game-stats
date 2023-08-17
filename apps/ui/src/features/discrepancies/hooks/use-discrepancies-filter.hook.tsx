import { useEffect, useState } from 'react';
import { GameDiscrepancy, PlayerDiscrepancy, TeamDiscrepancy } from 'types';
import { uniq } from 'lodash';
import { SelectChangeEvent } from '@mui/material';

export const useDiscrepanciesFilter = <
  T extends TeamDiscrepancy | GameDiscrepancy | PlayerDiscrepancy,
>(
  discrepancies: T[] | undefined,
  idSelector: (arg: T) => string,
) => {
  const ALL = 'All';
  const [filterId, setFilterId] = useState(ALL);
  const [filterIds, setFilterIds] = useState<string[]>([]);

  useEffect(() => {
    if (discrepancies) {
      setFilterIds(uniq([ALL, ...discrepancies.map(discrepancy => idSelector(discrepancy))]));
    }
  }, [discrepancies, idSelector]);

  const handleIdFilterChanged = (event: SelectChangeEvent) => {
    setFilterId(event.target.value as string);
  };

  const [filteredDiscrepancies, seFilteredDiscrepancies] = useState<T[]>(discrepancies ?? []);

  useEffect(() => {
    seFilteredDiscrepancies(
      filterId === ALL
        ? discrepancies ?? []
        : discrepancies?.filter(discrepancy => idSelector(discrepancy) === filterId) ?? [],
    );
  }, [filterId, discrepancies, ALL, idSelector]);

  return {
    handleIdFilterChanged,
    filterId,
    filterIds,
    filteredDiscrepancies,
  };
};
