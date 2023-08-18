import { Link, useLocation } from 'react-router-dom';

const NavElement = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li className={'p-2 ' + (isActive ? 'font-bold rounded border border-slate-300' : '')}>
      <Link to={to}>{label}</Link>
    </li>
  );
};

export const NavigationComponent = () => {
  return (
    <nav className="w-full">
      <div className="py-6 px-3 mb-6 border-b-2 text-slate-300">
        <h1 className="text-4xl font-bold">
          <Link to="/">Game Stats</Link>
        </h1>
      </div>
      <ul className="space-y-4 text-slate-200 w-full">
        <NavElement to="/discrepancies" label="All Discrepancies" />
        <NavElement to="/discrepancies/team" label="Team Discrepancies" />
        <NavElement to="/discrepancies/player" label="Player Discrepancies" />
        <NavElement to="/discrepancies/game" label="Game Discrepancies" />
      </ul>
    </nav>
  );
};
