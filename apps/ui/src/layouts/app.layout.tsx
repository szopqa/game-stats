import { Outlet } from 'react-router-dom';
import { NavigationComponent } from '../components/navigation.components';

export default function MainLayout() {
  return (
    <div className="h-screen w-screen flex">
      <div className="w-1/6 bg-nav-bar p-4 flex flex-col items-center">
        <NavigationComponent />
      </div>
      <div className="w-5/6 p-4 bg-page-default">
        <Outlet />
      </div>
    </div>
  );
}
