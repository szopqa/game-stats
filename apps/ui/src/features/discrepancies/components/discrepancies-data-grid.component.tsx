import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useState } from 'react';
import { DiscrepancyRow } from '../mappers/discrepancies-data-grid.mapper';

type DiscrepanciesDataGrid = {
  rows: DiscrepancyRow[];
  columns: GridColDef[];
  onRowSelected: (selectedRows: GridRowSelectionModel) => void;
};

export const DiscrepanciesDataGrid = (props: DiscrepanciesDataGrid) => {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={props.rows}
          columns={props.columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          onRowSelectionModelChange={newRowSelectionModel => {
            setRowSelectionModel(newRowSelectionModel);
            props.onRowSelected(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          checkboxSelection
        />
      </Box>
    </>
  );
};
