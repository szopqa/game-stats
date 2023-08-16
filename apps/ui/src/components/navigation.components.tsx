import { Link, useLocation } from 'react-router-dom';

const NavElement = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link to={to} className={isActive ? 'font-semibold' : ''}>
        {label}
      </Link>
    </li>
  );
};

export const NavigationComponent = () => {
  return (
    <nav>
      <div className="p-2 mb-7 flex flex-row gap-2 w-full border-b-2">
        <h1 className="text-xl font-bold">Game stats</h1>
      </div>
      <ul className="space-y-4 text-slate-400">
        <NavElement to="/discrepancies/all" label="All Discrepancies" />
        <NavElement to="/discrepancies/team" label="Team Discrepancies" />
        <NavElement to="/discrepancies/player" label="Player Discrepancies" />
        <NavElement to="/discrepancies/game" label="Game Discrepancies" />
      </ul>
    </nav>
  );
};
