import { Button } from '@mui/material';

type DiscrepanciesActionsPanelProps = {
  handleIgnore: () => void;
  handleResolve: () => void;
};

export const DiscrepanciesActionsPanel = (props: DiscrepanciesActionsPanelProps) => {
  return (
    <>
      <div className="flex flex-row justify-end space-x-8">
        <Button variant="outlined" onClick={props.handleIgnore}>
          Ignore
        </Button>
        <Button variant="outlined" onClick={props.handleResolve}>
          Resolve
        </Button>
      </div>
    </>
  );
};
