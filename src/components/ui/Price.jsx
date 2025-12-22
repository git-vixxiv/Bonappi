export default function Price({
  amount,
  originalAmount,
  size = 'md',
  showCurrency = true,
  className = '',
}) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: showCurrency ? 'currency' : 'decimal',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const hasDiscount = originalAmount && originalAmount > amount;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`${sizes[size]} font-semibold text-gray-900`}>
        {formatPrice(amount)}
      </span>
      {hasDiscount && (
        <span className={`${sizes[size]} text-gray-400 line-through`}>
          {formatPrice(originalAmount)}
        </span>
      )}
    </div>
  );
}

// Price level indicator ($ to $$$$)
export function PriceLevel({ level, maxLevel = 4, size = 'md', className = '' }) {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <span className={`${sizes[size]} ${className}`}>
      <span className="text-gray-900 font-medium">
        {'$'.repeat(level)}
      </span>
      <span className="text-gray-300">
        {'$'.repeat(maxLevel - level)}
      </span>
    </span>
  );
}
