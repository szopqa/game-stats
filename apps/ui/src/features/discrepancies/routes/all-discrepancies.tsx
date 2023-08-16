import { GameDiscrepancy, PlayerDiscrepancy, TeamDiscrepancy } from 'types';
import { useDiscrepancies } from '../api/discrepancies.api';
import { GridColDef } from '@mui/x-data-grid';
import { useCallback } from 'react';
import { useDiscrepanciesFilter } from '../hooks/use-discrepancies-filter.hook';
import { toAllDiscrepancies } from '../mappers/discrepancies-data-grid.mapper';
import { DiscrepanciesFilterDropdown } from '../components/discrepancies-filter-dropdown.component';
import { DiscrepanciesActionsPanel } from '../components/discrepancies-actions-panel.component';
import { DiscrepanciesDataGrid } from '../components/discrepancies-data-grid.component';

const ALL_DISCREPANCIES_COLUMNSeRows: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 50 },
  {
    field: 'statType',
    headerName: 'Discrepancy type',
    width: 150,
  },
  {
    field: 'statName',
    headerName: 'Name',
    width: 150,
  },
  {
    field: 'value',
    headerName: 'Value',
    type: 'number',
    width: 100,
  },
  {
    field: 'sourceId',
    headerName: 'Source',
    width: 100,
  },
  {
    field: 'gameId',
    headerName: 'Game id',
    width: 300,
  },
  {
    field: 'teamId',
    headerName: 'Team id',
    width: 300,
  },
  {
    field: 'playerId',
    headerName: 'Player id',
    width: 300,
  },
  {
    field: 'discrepancyId',
    headerName: 'Discrepancy ID',
    width: 500,
  },
];

export const AllDiscrepancies = () => {
  const LABEL_NAME = 'Game ID';
  const { discrepancies } = useDiscrepancies<TeamDiscrepancy | GameDiscrepancy | PlayerDiscrepancy>(
    'ALL',
  );
  const { filterId, filterIds, handleIdFilterChanged, discrepanciesToShow } =
    useDiscrepanciesFilter<TeamDiscrepancy | GameDiscrepancy | PlayerDiscrepancy>(
      discrepancies,
      useCallback(
        (discrepancy: TeamDiscrepancy | GameDiscrepancy | PlayerDiscrepancy) =>
          discrepancy.meta.gameId,
        [],
      ),
    );

  return (
    discrepancies && (
      <>
        <DiscrepanciesFilterDropdown
          filterId={filterId}
          filterIds={filterIds}
          handleIdFilterChanged={handleIdFilterChanged}
          labelName={LABEL_NAME}
        />
        <DiscrepanciesDataGrid
          rows={toAllDiscrepancies(discrepanciesToShow)}
          columns={ALL_DISCREPANCIES_COLUMNSeRows}
          onRowSelected={selectedRows => console.log(selectedRows)}
        />
        <DiscrepanciesActionsPanel
          handleIgnore={() => alert('ignored')}
          handleResolve={() => alert('resolved')}
        />
      </>
    )
  );
};
