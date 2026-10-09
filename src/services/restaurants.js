import { supabase } from './supabase';

// Downtown Austin, used for distance until we ask for the diner's location
const DEFAULT_ORIGIN = { lat: 30.2682, lng: -97.7429 };

const PRICE_KEYS = new Set(['priceModifier', 'price', 'discount']);

// Customization prices are stored in cents; the UI works in dollars
function priceTreeToDollars(value, key) {
  if (Array.isArray(value)) return value.map((v) => priceTreeToDollars(v));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, priceTreeToDollars(v, k)])
    );
  }
  if (PRICE_KEYS.has(key) && typeof value === 'number') return value / 100;
  return value;
}

function distanceMiles(from, to) {
  if (to.lat == null || to.lng == null) return null;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(to.lat - from.lat);
  const dLng = rad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(from.lat)) * Math.cos(rad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(3958.8 * 2 * Math.asin(Math.sqrt(a)) * 10) / 10;
}

const formatTime = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
};

// "Open now", "Opens 5:00 PM" or "Closed today", in the restaurant's timezone
function openStatus(hours, timezone, now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value])
  );
  const today = hours?.[parts.weekday.toLowerCase()];
  if (!today) return { isOpen: false, label: 'Closed today' };
  const current = `${parts.hour}:${parts.minute}`;
  if (current >= today.open && current < today.close) return { isOpen: true, label: 'Open now' };
  if (current < today.open) return { isOpen: false, label: `Opens ${formatTime(today.open)}` };
  return { isOpen: false, label: 'Closed now' };
}

export function mapRestaurant(row) {
  const coordinates = { lat: row.lat, lng: row.lng };
  const status = openStatus(row.hours, row.timezone);
  return {
    id: row.slug,
    dbId: row.id,
    name: row.name,
    description: row.description,
    cuisine: row.cuisine,
    priceLevel: row.price_level,
    location: {
      address: row.address,
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
      coordinates,
    },
    hours: row.hours,
    timezone: row.timezone,
    photo: row.photo_url,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    features: row.features,
    // Pre-orders can be placed while closed, so availability tracks the
    // restaurant's order switch; open status is shown as a label
    isAvailable: row.accepting_orders,
    isOpen: status.isOpen,
    nextAvailableTime: row.accepting_orders ? status.label : 'Not taking orders',
    distance: distanceMiles(DEFAULT_ORIGIN, coordinates),
    minOrder: row.min_order_cents / 100,
    taxRate: row.tax_rate_bps / 10000,
  };
}

export function mapMenuItem(row, restaurantSlug) {
  return {
    id: row.slug,
    dbId: row.id,
    restaurantId: restaurantSlug,
    name: row.name,
    description: row.description,
    category: row.category,
    basePrice: row.base_price_cents / 100,
    photo: row.photo_url,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    dietaryInfo: row.dietary_info,
    popular: row.is_popular,
    isAvailable: row.is_available,
    customizations: priceTreeToDollars(row.customizations),
  };
}

export async function listRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('is_listed', true)
    .order('name');
  if (error) throw error;
  return data.map(mapRestaurant);
}

// One restaurant by slug, with its menu
export async function getRestaurantWithMenu(slug) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, menu_items(*)')
    .eq('slug', slug)
    .order('sort_order', { referencedTable: 'menu_items' })
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { menu_items: items, ...row } = data;
  return {
    restaurant: mapRestaurant(row),
    menu: items.map((item) => mapMenuItem(item, row.slug)),
  };
}
