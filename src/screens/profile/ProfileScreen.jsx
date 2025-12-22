import { useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  Star,
  History,
  Trophy,
  CreditCard,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Header, ScreenWrapper } from '../../components/layout';
import { Card, Badge, Button } from '../../components/ui';
import { useAuth } from '../../contexts';
import { getUserLevel } from '../../constants/levels';
import { ROUTES } from '../../constants/routes';

const menuItems = [
  { icon: Heart, label: 'Favorite Dishes', route: ROUTES.FAVORITES, badge: '12' },
  { icon: Star, label: 'My Reviews', route: ROUTES.REVIEWS, badge: '32' },
  { icon: History, label: 'Order History', route: ROUTES.ORDER_HISTORY },
  { icon: Trophy, label: 'Achievements', route: ROUTES.ACHIEVEMENTS, badge: '3/12' },
  { icon: CreditCard, label: 'Payment Methods', route: ROUTES.PAYMENT_METHODS },
  { icon: Settings, label: 'Settings', route: ROUTES.SETTINGS },
];

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout, devLogin, isAuthenticated } = useAuth();

  const currentLevel = getUserLevel(user?.totalVisits || 0);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Profile" />
        <ScreenWrapper className="py-4">
          <Card className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign in to BonAppi
            </h2>
            <p className="text-gray-500 mb-6 max-w-xs mx-auto">
              Track your favorite dishes, earn status, and never forget your perfect order.
            </p>
            <div className="space-y-3 max-w-xs mx-auto">
              <Button fullWidth onClick={() => navigate(ROUTES.LOGIN)}>
                Sign In
              </Button>
              <Button variant="outline" fullWidth onClick={() => navigate(ROUTES.REGISTER)}>
                Create Account
              </Button>
              {/* Dev helper button */}
              <Button variant="ghost" size="sm" fullWidth onClick={devLogin}>
                Dev: Quick Login
              </Button>
            </div>
          </Card>
        </ScreenWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Profile" />

      <ScreenWrapper className="py-4">
        {/* User Card */}
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-primary-600" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="regular" size="sm" icon={currentLevel.icon}>
                  {currentLevel.name}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex justify-around mt-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{user.totalVisits}</p>
              <p className="text-xs text-gray-500">Visits</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{user.totalReviews}</p>
              <p className="text-xs text-gray-500">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">
                {user.regularRestaurants?.length || 0}
              </p>
              <p className="text-xs text-gray-500">Regular</p>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <Card padding="none" className="mb-6 overflow-hidden">
          {menuItems.map(({ icon: Icon, label, route, badge }, index) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className={`
                w-full flex items-center gap-4 px-4 py-3.5
                hover:bg-gray-50 transition-colors text-left
                ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''}
              `}
            >
              <Icon className="w-5 h-5 text-gray-500" />
              <span className="flex-1 font-medium text-gray-900">{label}</span>
              {badge && <Badge variant="secondary" size="sm">{badge}</Badge>}
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </Card>

        {/* Logout */}
        <Button
          variant="ghost"
          fullWidth
          leftIcon={<LogOut className="w-5 h-5" />}
          onClick={handleLogout}
          className="text-error-500 hover:bg-error-50"
        >
          Sign Out
        </Button>

        {/* App version */}
        <p className="text-center text-xs text-gray-400 mt-6">
          BonAppi v0.1.0 (Beta)
        </p>
      </ScreenWrapper>
    </div>
  );
}
