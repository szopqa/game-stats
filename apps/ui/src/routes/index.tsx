import { useRoutes } from 'react-router-dom';
import AppLayout from '../layouts/app.layout';
import { DiscrepanciesRouter } from '../features/discrepancies';

const Landing = () => {
  return <h1 className="text-center text-5xl">Game stats</h1>;
};

const APP_ROUTES = [
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/discrepancies/*', element: <DiscrepanciesRouter /> },
    ],
  },
];

export const AppRoutes = () => {
  const routeElement = useRoutes(APP_ROUTES);

  return routeElement;
};
