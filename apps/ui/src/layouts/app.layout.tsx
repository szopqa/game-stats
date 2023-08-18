import { Outlet } from 'react-router-dom';
import { NavigationComponent } from '../components/navigation.components';

export default function MainLayout() {
  return (
    <div className="h-screen w-screen flex">
      <div className="w-1/5 bg-nav-bar p-4 flex flex-col items-center">
        <NavigationComponent />
      </div>
      <div className="w-4/5 p-8 bg-page-default">
        <Outlet />
      </div>
    </div>
  );
}
