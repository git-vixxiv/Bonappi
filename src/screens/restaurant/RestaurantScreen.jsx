import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  MapPin,
  Phone,
  Globe,
  Star,
  ChevronRight,
} from 'lucide-react';
import { Button, Card, Badge, StarRating, PriceLevel } from '../../components/ui';
import { MenuItemCard } from '../../components/restaurant';
import { getRestaurantById } from '../../data/restaurants';
import { getMenuByRestaurant, getPopularItems, getItemsByCategory } from '../../data/menuItems';
import { getDishRoute, ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts';

const TABS = [
  { id: 'popular', label: 'Popular' },
  { id: 'menu', label: 'Full Menu' },
  { id: 'about', label: 'About' },
];

export default function RestaurantScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('popular');
  const [isFavorite, setIsFavorite] = useState(false);

  const restaurant = getRestaurantById(id);
  const menuItems = getMenuByRestaurant(id);
  const popularItems = getPopularItems(id);
  const itemsByCategory = useMemo(() => getItemsByCategory(id), [id]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Restaurant not found</h1>
          <Button onClick={() => navigate(ROUTES.HOME)}>Go Home</Button>
        </div>
      </div>
    );
  }

  const {
    name,
    description,
    cuisine,
    photo,
    rating,
    reviewCount,
    priceLevel,
    location,
    hours,
    features,
    isAvailable,
    nextAvailableTime,
  } = restaurant;

  // Get today's hours
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayHours = hours[today];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-56 bg-gray-200">
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top navigation */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
              />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="relative px-4 pb-4 -mt-8">
        <Card className="relative z-10">
          {/* Name and cuisine */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
              <p className="text-gray-500">{cuisine.join(' • ')}</p>
            </div>
            <PriceLevel level={priceLevel} size="lg" />
          </div>

          {/* Rating and reviews */}
          <div className="flex items-center gap-4 mb-4">
            <StarRating rating={rating} reviewCount={reviewCount} size="md" />
          </div>

          {/* Quick info row */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            {todayHours && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{todayHours.open} - {todayHours.close}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location.address.split(',')[0]}</span>
            </div>
          </div>

          {/* Reserve button */}
          <Button
            fullWidth
            size="lg"
            disabled={!isAvailable}
          >
            {isAvailable ? `Reserve · ${nextAvailableTime}` : `Unavailable · ${nextAvailableTime}`}
          </Button>
        </Card>
      </div>

      {/* Your Usual Orders (if logged in and has history) */}
      {user && (
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Your Usual</h2>
            <button className="text-primary-600 text-sm font-medium flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Card variant="outlined" className="text-center py-6">
            <p className="text-gray-500 text-sm">
              Order your first meal here to save your usual!
            </p>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200">
        <div className="flex px-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'text-primary-600 border-primary-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4 pb-24">
        {/* Popular Tab */}
        {activeTab === 'popular' && (
          <div className="space-y-3">
            {popularItems.length > 0 ? (
              popularItems.map((item) => (
                <MenuItemCard key={item.id} item={item} restaurantId={id} />
              ))
            ) : (
              <Card variant="outlined" className="text-center py-8">
                <p className="text-gray-500">No popular items yet</p>
              </Card>
            )}
          </div>
        )}

        {/* Full Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {Object.keys(itemsByCategory).length > 0 ? (
              Object.entries(itemsByCategory).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <MenuItemCard key={item.id} item={item} restaurantId={id} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <Card variant="outlined" className="text-center py-8">
                <p className="text-gray-500">Menu not available</p>
              </Card>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            {/* Description */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </Card>

            {/* Hours */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Hours</h3>
              <div className="space-y-2 text-sm">
                {Object.entries(hours).map(([day, time]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{day}</span>
                    <span className="text-gray-900">
                      {time.open} - {time.close}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Location */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900">{location.address}</p>
                  <p className="text-gray-500 text-sm">
                    {location.city}, {location.state} {location.zipCode}
                  </p>
                </div>
              </div>
            </Card>

            {/* Features */}
            {features && features.length > 0 && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
