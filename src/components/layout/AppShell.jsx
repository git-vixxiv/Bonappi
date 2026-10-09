import { Outlet, useMatch } from 'react-router-dom';
import BottomNav from './BottomNav';
import { ROUTES } from '../../constants/routes';

export default function AppShell() {
  // Dish and cart screens have their own fixed action bar, which the nav would cover
  const onDish = useMatch(ROUTES.DISH);
  const onCart = useMatch(ROUTES.CART);
  const showNav = !onDish && !onCart;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main content area with bottom padding for nav */}
      <main className={`flex-1 max-w-lg mx-auto w-full ${showNav ? 'pb-20' : ''}`}>
        <Outlet />
      </main>

      {showNav && <BottomNav />}
    </div>
  );
}
