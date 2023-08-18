import { Button } from '@mui/material';
import { IS_RESOLVE_FEATURE_AVAILABLE } from '../../../config';

type DiscrepanciesActionsPanelProps = {
  handleIgnore: () => void;
  handleResolve: () => void;
};

export const DiscrepanciesActionsPanel = (props: DiscrepanciesActionsPanelProps) => {
  return (
    <>
      <div className="flex flex-row justify-end space-x-8 mt-8">
        <Button variant="outlined" onClick={props.handleIgnore}>
          Ignore
        </Button>
        {IS_RESOLVE_FEATURE_AVAILABLE && (
          <Button variant="outlined" onClick={props.handleResolve}>
            Resolve
          </Button>
        )}
      </div>
    </>
  );
};
