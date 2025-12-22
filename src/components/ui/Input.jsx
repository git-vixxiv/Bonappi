import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  const baseInputStyles = `
    w-full px-4 py-3 rounded-lg border transition-colors duration-200
    placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `;

  const inputStateStyles = error
    ? 'border-error-500 focus:ring-error-500'
    : 'border-gray-300 hover:border-gray-400';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            ${baseInputStyles}
            ${inputStateStyles}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-error-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

// Textarea variant
export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  rows = 4,
  ...props
}, ref) => {
  const baseStyles = `
    w-full px-4 py-3 rounded-lg border transition-colors duration-200
    placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    resize-none
  `;

  const stateStyles = error
    ? 'border-error-500 focus:ring-error-500'
    : 'border-gray-300 hover:border-gray-400';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`${baseStyles} ${stateStyles}`}
        {...props}
      />
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-error-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
