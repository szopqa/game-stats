import { Route, Routes } from 'react-router-dom';
import { AllDiscrepancies } from './all-discrepancies';
import { GameDiscrepancies } from './game-discrepancies';
import { TeamDiscrepancies } from './team-discrepancies';
import { PlayerDiscrepancies } from './player-discrepancies';

export const DiscrepanciesRouter = () => {
  return (
    <Routes>
      <Route path="/all" element={<AllDiscrepancies />} />
      <Route path="/game" element={<GameDiscrepancies />} />
      <Route path="/team" element={<TeamDiscrepancies />} />
      <Route path="/player" element={<PlayerDiscrepancies />} />
    </Routes>
  );
};
