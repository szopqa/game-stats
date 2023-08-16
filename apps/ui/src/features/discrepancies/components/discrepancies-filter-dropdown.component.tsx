import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

type DiscrepanciesFilterDropdownProps = {
  labelName: string;
  filterId: string;
  filterIds: string[];
  handleIdFilterChanged: (event: SelectChangeEvent) => void;
};

export const DiscrepanciesFilterDropdown = (props: DiscrepanciesFilterDropdownProps) => {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="team-id">{props.labelName}</InputLabel>
        <Select
          labelId="team-id"
          id="demo-simple-select"
          value={props.filterId}
          label={props.labelName}
          onChange={props.handleIdFilterChanged}
        >
          {props.filterIds.map(id => (
            <MenuItem value={id} key={id}>
              {id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
