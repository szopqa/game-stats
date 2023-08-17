import { TeamDiscrepancy } from 'types';
import { useDiscrepancies } from '../api/discrepancies.api';
import { useCallback } from 'react';
import { useDiscrepanciesFilter } from '../hooks/use-discrepancies-filter.hook';
import { toTeamRows } from '../mappers/discrepancies-data-grid.mapper';
import { DiscrepanciesFilterDropdown } from '../components/discrepancies-filter-dropdown.component';
import { DiscrepanciesActionsPanel } from '../components/discrepancies-actions-panel.component';
import { DiscrepanciesDataGrid } from '../components/discrepancies-data-grid.component';
import { GridColDef } from '@mui/x-data-grid';
import { useDiscrepanciesIgnore } from '../hooks/use-discrepancies-ignore.hook';

const TEAM_DISCREPANCIES_COLUMNS: GridColDef[] = [
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
    field: 'discrepancyId',
    headerName: 'Discrepancy ID',
    width: 500,
  },
];

export const TeamDiscrepancies = () => {
  const LABEL_NAME = 'Team ID';
  const { discrepancies } = useDiscrepancies<TeamDiscrepancy>('TEAM');
  const { filterId, filterIds, handleIdFilterChanged, filteredDiscrepancies } =
    useDiscrepanciesFilter<TeamDiscrepancy>(
      discrepancies,
      useCallback((discrepancy: TeamDiscrepancy) => discrepancy.meta.teamId, []),
    );

  const { handleIgnore, setIgnoreSelectedIds, discrepanciesToShow } = useDiscrepanciesIgnore(
    filteredDiscrepancies,
    useCallback(discrepancies => toTeamRows(discrepancies), []),
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
          rows={discrepanciesToShow}
          columns={TEAM_DISCREPANCIES_COLUMNS}
          onRowSelected={selectedRows => setIgnoreSelectedIds(selectedRows as number[])}
        />
        <DiscrepanciesActionsPanel
          handleIgnore={handleIgnore}
          handleResolve={() => alert('resolved')}
        />
      </>
    )
  );
};
