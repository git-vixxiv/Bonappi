import { useAsync } from './useAsync';
import { listRestaurants, getRestaurantWithMenu } from '../services/restaurants';

export const useRestaurants = () => useAsync(listRestaurants, []);

export const useRestaurant = (slug) => useAsync(() => getRestaurantWithMenu(slug), [slug]);
