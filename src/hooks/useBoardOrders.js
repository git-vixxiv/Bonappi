import { useCallback, useEffect, useState } from 'react';
import { listBoardOrders } from '../services/staff';
import { startOfZonedDay } from '../utils/time';

const POLL_MS = 15000;

// Keeps the order board fresh by polling; keeps showing the last good data
// while a refresh is in flight or fails.
export function useBoardOrders(restaurant) {
  const [state, setState] = useState({ orders: null, error: null, restaurantId: null });

  const refresh = useCallback(async () => {
    if (!restaurant) return;
    try {
      const since = startOfZonedDay(restaurant.timezone).toISOString();
      const orders = await listBoardOrders(restaurant.id, { since });
      setState({ orders, error: null, restaurantId: restaurant.id });
    } catch (error) {
      setState((s) => ({ ...s, error }));
    }
  }, [restaurant]);

  useEffect(() => {
    const first = setTimeout(refresh, 0);
    const timer = setInterval(refresh, POLL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [refresh]);

  const current = state.restaurantId === restaurant?.id;
  return {
    orders: current ? state.orders : null,
    error: state.error,
    refresh,
  };
}
