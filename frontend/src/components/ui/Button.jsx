import PropTypes from 'prop-types';

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'text-white bg-primary hover:bg-primary-dark focus:ring-primary',
    secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600',
    outline: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-primary dark:text-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
}; 