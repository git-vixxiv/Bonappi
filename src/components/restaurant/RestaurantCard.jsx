import { useNavigate } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { Card, Badge, StarRating, PriceLevel } from '../ui';
import { getRestaurantRoute } from '../../constants/routes';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const {
    id,
    name,
    cuisine,
    photo,
    rating,
    reviewCount,
    priceLevel,
    isAvailable,
    nextAvailableTime,
    distance,
  } = restaurant;

  const handleClick = () => {
    navigate(getRestaurantRoute(id));
  };

  return (
    <Card
      hoverable
      padding="none"
      onClick={handleClick}
      className="overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
              {name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {cuisine.join(' • ')}
            </p>
          </div>
          <PriceLevel level={priceLevel} />
        </div>

        {/* Rating and distance */}
        <div className="flex items-center gap-4 mb-3">
          <StarRating rating={rating} reviewCount={reviewCount} size="sm" />
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {distance} mi
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className={`w-4 h-4 ${isAvailable ? 'text-success-500' : 'text-gray-400'}`} />
            <span className={`text-sm font-medium ${isAvailable ? 'text-success-600' : 'text-gray-500'}`}>
              {nextAvailableTime}
            </span>
          </div>
          {isAvailable && (
            <Badge variant="primary" size="sm">
              Reserve
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
