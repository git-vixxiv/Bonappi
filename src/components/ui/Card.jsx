import { forwardRef } from 'react';

const Card = forwardRef(({
  children,
  variant = 'elevated',
  padding = 'md',
  hoverable = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  const variants = {
    elevated: 'bg-white shadow-sm',
    outlined: 'bg-white border border-gray-200',
    filled: 'bg-gray-50',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const baseStyles = 'rounded-xl overflow-hidden';
  const hoverStyles = hoverable
    ? 'cursor-pointer transition-shadow duration-200 hover:shadow-md active:shadow-sm'
    : '';

  return (
    <div
      ref={ref}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverStyles}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;

// Card subcomponents for structured layouts
export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-3 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>{children}</div>
);
