import { useRoutes } from 'react-router-dom';
import AppLayout from '../layouts/app.layout';
import { DiscrepanciesRouter } from '../features/discrepancies';

const APP_ROUTES = [
  {
    element: <AppLayout />,
    children: [{ path: '/discrepancies/*', element: <DiscrepanciesRouter /> }],
  },
];

export const AppRoutes = () => {
  const routeElement = useRoutes(APP_ROUTES);

  return routeElement;
};
