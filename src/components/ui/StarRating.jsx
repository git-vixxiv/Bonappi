import { Star } from 'lucide-react';

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = true,
  reviewCount,
  interactive = false,
  onChange,
  className = '',
}) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  const handleClick = (index) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (interactive && onChange && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onChange(index + 1);
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => {
          const isFilled = index < Math.floor(rating);
          const isHalf = index === Math.floor(rating) && rating % 1 >= 0.5;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
                ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
                disabled:cursor-default
              `}
              aria-label={interactive ? `Rate ${index + 1} stars` : undefined}
            >
              <Star
                className={`
                  ${sizes[size]}
                  ${isFilled || isHalf ? 'fill-warning-500 text-warning-500' : 'text-gray-300'}
                `}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={`${textSizes[size]} font-medium text-gray-700 ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={`${textSizes[size]} text-gray-500`}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
