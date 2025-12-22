import { NavLink } from 'react-router-dom';
import { Home, Trophy, User } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const navItems = [
  {
    to: ROUTES.DISCOVER,
    icon: Home,
    label: 'Discover',
  },
  {
    to: ROUTES.STATUS,
    icon: Trophy,
    label: 'Status',
  },
  {
    to: ROUTES.PROFILE,
    icon: User,
    label: 'Profile',
  },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full
              transition-colors duration-200
              ${isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`}
                />
                <span className="text-xs mt-1 font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
