import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { Header } from '../../components/layout';
import { Button, Input } from '../../components/ui';
import { RestaurantCard } from '../../components/restaurant';
import { restaurants, searchRestaurants } from '../../data';
import { useAuth, useCart } from '../../contexts';
import { ROUTES } from '../../constants/routes';

export default function DiscoveryScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredRestaurants = useMemo(() => {
    if (!searchQuery.trim()) return restaurants;
    return searchRestaurants(searchQuery);
  }, [searchQuery]);

  const location = user?.location
    ? `${user.location.city}, ${user.location.state}`
    : 'Austin, TX';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        showLocation
        location={location}
        rightAction={
          <button
            onClick={() => navigate(ROUTES.CART)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
        }
      />

      {/* Search and Filters */}
      <div className="sticky top-14 z-30 bg-gray-50 px-4 py-3 border-b border-gray-100">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search restaurants or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              className="!mb-0"
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="!px-3"
            aria-label="Filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Filter Pills - Coming soon */}
        {showFilters && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            <Button variant="outline" size="sm">Cuisine</Button>
            <Button variant="outline" size="sm">Price</Button>
            <Button variant="outline" size="sm">Distance</Button>
            <Button variant="outline" size="sm">Rating</Button>
            <Button variant="outline" size="sm">Available Now</Button>
          </div>
        )}
      </div>

      {/* Restaurant List */}
      <div className="px-4 py-4">
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No restaurants found</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
