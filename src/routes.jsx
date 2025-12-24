import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './components/layout';
import { ROUTES } from './constants/routes';

// Screens
import DiscoveryScreen from './screens/discovery/DiscoveryScreen';
import StatusScreen from './screens/status/StatusScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RestaurantScreen from './screens/restaurant/RestaurantScreen';
import DishScreen from './screens/restaurant/DishScreen';

// Placeholder screens for routes we haven't built yet
const PlaceholderScreen = ({ title }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-500">Coming soon</p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  // Auth routes (no bottom nav)
  {
    path: ROUTES.LOGIN,
    element: <LoginScreen />,
  },
  {
    path: ROUTES.REGISTER,
    element: <PlaceholderScreen title="Register" />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <PlaceholderScreen title="Forgot Password" />,
  },

  // Main app routes (with bottom nav)
  {
    element: <AppShell />,
    children: [
      {
        path: ROUTES.DISCOVER,
        element: <DiscoveryScreen />,
      },
      {
        path: ROUTES.STATUS,
        element: <StatusScreen />,
      },
      {
        path: ROUTES.PROFILE,
        element: <ProfileScreen />,
      },
      {
        path: ROUTES.RESTAURANT,
        element: <RestaurantScreen />,
      },
      {
        path: ROUTES.DISH,
        element: <DishScreen />,
      },
      {
        path: ROUTES.CART,
        element: <PlaceholderScreen title="Cart" />,
      },
      {
        path: ROUTES.CHECKOUT,
        element: <PlaceholderScreen title="Checkout" />,
      },
      {
        path: ROUTES.FAVORITES,
        element: <PlaceholderScreen title="Favorite Dishes" />,
      },
      {
        path: ROUTES.REVIEWS,
        element: <PlaceholderScreen title="My Reviews" />,
      },
      {
        path: ROUTES.ORDER_HISTORY,
        element: <PlaceholderScreen title="Order History" />,
      },
      {
        path: ROUTES.ACHIEVEMENTS,
        element: <PlaceholderScreen title="Achievements" />,
      },
      {
        path: ROUTES.PAYMENT_METHODS,
        element: <PlaceholderScreen title="Payment Methods" />,
      },
      {
        path: ROUTES.SETTINGS,
        element: <PlaceholderScreen title="Settings" />,
      },
    ],
  },
]);
