import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, RefreshCw } from 'lucide-react';
import { ScreenState } from '../../components/layout';
import OrderCard from '../../components/kitchen/OrderCard';
import { useAuth } from '../../contexts';
import { useAsync } from '../../hooks/useAsync';
import { useBoardOrders } from '../../hooks/useBoardOrders';
import { listMyRestaurants, advanceOrder } from '../../services/staff';
import { ROUTES } from '../../constants/routes';

const COLUMNS = [
  { status: 'pending', title: 'New' },
  { status: 'accepted', title: 'Upcoming' },
  { status: 'arrived', title: 'Here' },
  { status: 'firing', title: 'Cooking' },
  { status: 'served', title: 'Served' },
];

// Tablet dashboard for restaurant staff
export default function KitchenScreen() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const restaurants = useAsync(
    () => (user ? listMyRestaurants(user.id) : Promise.resolve([])),
    [user?.id]
  );
  const [selectedId, setSelectedId] = useState(null);
  const restaurant =
    restaurants.data?.find((r) => r.id === selectedId) ?? restaurants.data?.[0] ?? null;

  const { orders, error, refresh } = useBoardOrders(restaurant);

  // Re-render every 30s so "minutes late" stays current
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const byStatus = useMemo(() => {
    const groups = Object.fromEntries(COLUMNS.map((c) => [c.status, []]));
    for (const order of orders ?? []) groups[order.status]?.push(order);
    return groups;
  }, [orders]);
  const closedToday = (orders ?? []).filter((o) => o.status === 'closed').length;

  const handleAdvance = async (orderId, status, finalCheckCents) => {
    await advanceOrder(orderId, status, finalCheckCents);
    await refresh();
  };

  if (authLoading) return <ScreenState loading />;
  if (!isAuthenticated) return <Navigate to={`${ROUTES.LOGIN}?next=${ROUTES.KITCHEN}`} replace />;
  if (restaurants.loading) return <ScreenState loading />;
  if (restaurants.error) {
    return <ScreenState title="Could not load your restaurant" message="Check your connection and try again." />;
  }
  if (!restaurant) {
    return (
      <ScreenState
        title="No restaurant linked"
        message="This account isn't set up as restaurant staff yet. Contact BonAppi to get access."
        actionLabel="Back to BonAppi"
        onAction={() => navigate(ROUTES.HOME)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 bg-primary-700 text-white">
        <div className="flex items-center justify-between gap-4 px-4 h-14">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/logo.png" alt="" className="h-7 w-auto bg-white rounded px-1" />
            {restaurants.data.length > 1 ? (
              <select
                value={restaurant.id}
                onChange={(e) => setSelectedId(e.target.value)}
                className="bg-primary-800 rounded px-2 py-1 text-white"
                aria-label="Restaurant"
              >
                {restaurants.data.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            ) : (
              <h1 className="font-semibold truncate">{restaurant.name}</h1>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-primary-100">{closedToday} closed today</span>
            <button onClick={refresh} className="p-2 rounded hover:bg-primary-600" aria-label="Refresh">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={async () => {
                await logout();
                navigate(ROUTES.LOGIN);
              }}
              className="p-2 rounded hover:bg-primary-600"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        {error && (
          <p className="bg-warning-500 text-white text-sm px-4 py-1">
            Connection problem. Showing the last orders we loaded.
          </p>
        )}
      </header>

      {orders === null ? (
        <ScreenState loading />
      ) : (
        <main className="grid gap-3 p-3 md:grid-cols-3 xl:grid-cols-5">
          {COLUMNS.map((col) => (
            <section key={col.status} aria-label={col.title} className="min-w-0">
              <h2 className="flex items-center justify-between text-sm font-semibold text-gray-700 uppercase tracking-wide px-1 mb-2">
                {col.title}
                <span className="rounded-full bg-gray-200 text-gray-700 px-2 text-xs">
                  {byStatus[col.status].length}
                </span>
              </h2>
              <div className="space-y-2">
                {byStatus[col.status].map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    timezone={restaurant.timezone}
                    graceMinutes={restaurant.grace_minutes}
                    now={now}
                    onAdvance={handleAdvance}
                  />
                ))}
                {byStatus[col.status].length === 0 && (
                  <p className="text-sm text-gray-400 px-1">None</p>
                )}
              </div>
            </section>
          ))}
        </main>
      )}
    </div>
  );
}
