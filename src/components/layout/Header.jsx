import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function Header({
  title,
  subtitle,
  showBack = false,
  showLocation = false,
  location,
  rightAction,
  transparent = false,
  className = '',
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header
      className={`
        sticky top-0 z-40
        ${transparent ? 'bg-transparent' : 'bg-white border-b border-gray-100'}
        ${className}
      `}
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        {/* Left section */}
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          {showLocation && location && (
            <div className="flex items-center gap-1.5 text-gray-700">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium">{location}</span>
            </div>
          )}
          {title && (
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Right section */}
        {rightAction && (
          <div className="flex items-center">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  );
}
