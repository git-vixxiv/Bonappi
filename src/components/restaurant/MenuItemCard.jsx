import { useNavigate } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { Card, StarRating, PriceLevel } from '../ui';
import { getDishRoute } from '../../constants/routes';

export default function MenuItemCard({ item, restaurantId }) {
  const navigate = useNavigate();
  const {
    id,
    name,
    description,
    photo,
    basePrice,
    rating,
    reviewCount,
    dietaryInfo = [],
    popular,
  } = item;

  const handleClick = () => {
    navigate(getDishRoute(restaurantId, id));
  };

  // Dietary badges
  const dietaryBadges = {
    vegetarian: { label: 'V', color: 'bg-green-100 text-green-700' },
    vegan: { label: 'VG', color: 'bg-green-100 text-green-700' },
    'vegan-option': { label: 'VG*', color: 'bg-green-100 text-green-700' },
    'gluten-free': { label: 'GF', color: 'bg-amber-100 text-amber-700' },
  };

  return (
    <Card
      hoverable
      padding="none"
      onClick={handleClick}
      className="flex overflow-hidden"
    >
      {/* Content */}
      <div className="flex-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
              {popular && (
                <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full">
                  Popular
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
              {description}
            </p>
          </div>
        </div>

        {/* Rating and dietary info */}
        <div className="flex items-center gap-3 mt-2">
          {rating && (
            <StarRating rating={rating} reviewCount={reviewCount} size="sm" />
          )}
          {dietaryInfo.length > 0 && (
            <div className="flex gap-1">
              {dietaryInfo.map((diet) => {
                const badge = dietaryBadges[diet];
                if (!badge) return null;
                return (
                  <span
                    key={diet}
                    className={`text-xs px-1.5 py-0.5 rounded font-medium ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Price */}
        <p className="text-base font-semibold text-gray-900 mt-2">
          ${basePrice.toFixed(2)}
        </p>
      </div>

      {/* Image */}
      {photo && (
        <div className="w-24 h-24 flex-shrink-0 m-3">
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      )}
    </Card>
  );
}
