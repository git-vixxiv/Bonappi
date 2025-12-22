import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, CalendarDays } from 'lucide-react';
import { Header } from '../../components/layout';
import { Button, Input } from '../../components/ui';
import { RestaurantCard } from '../../components/restaurant';
import { restaurants, searchRestaurants } from '../../data';
import { useAuth } from '../../contexts';

export default function DiscoveryScreen() {
  const { user } = useAuth();
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
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CalendarDays className="w-4 h-4" />}
          >
            Reserve
          </Button>
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
