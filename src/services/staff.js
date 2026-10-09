import { supabase } from './supabase';

// Restaurants the signed-in user works at
export async function listMyRestaurants(userId) {
  const { data, error } = await supabase
    .from('restaurant_staff')
    .select('role, restaurants(id, slug, name, timezone, grace_minutes)')
    .eq('user_id', userId);
  if (error) throw error;
  return data.map((row) => ({ ...row.restaurants, role: row.role }));
}

// Orders for the board: today's (in the restaurant's day) plus anything
// still open from earlier, newest arrival last
export async function listBoardOrders(restaurantId, { since }) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(id, name, quantity, customizations, special_instructions)')
    .eq('restaurant_id', restaurantId)
    .or(`arrival_at.gte.${since},status.in.(pending,accepted,arrived,firing,served)`)
    .order('arrival_at');
  if (error) throw error;
  return data;
}

export async function advanceOrder(orderId, status, finalCheckCents = null) {
  const { data, error } = await supabase.rpc('advance_order', {
    p_order_id: orderId,
    p_status: status,
    p_final_check_cents: finalCheckCents,
  });
  if (error) throw error;
  return data;
}
