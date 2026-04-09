import PropTypes from 'prop-types';
import { clsx } from 'clsx';

const variants = {
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-cyan-100 text-cyan-800',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className,
  rounded = true,
  icon,
  removable = false,
  onRemove,
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium',
        variants[variant],
        sizes[size],
        rounded ? 'rounded-full' : 'rounded',
        className
      )}
    >
      {icon && <span className="mr-1 -ml-0.5">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={clsx(
            'ml-1 -mr-0.5 hover:bg-opacity-20 rounded-full focus:outline-none',
            {
              'p-0.5': size === 'sm',
              'p-1': size === 'md' || size === 'lg',
            }
          )}
        >
          <svg
            className={clsx('h-3 w-3', {
              'h-2 w-2': size === 'sm',
              'h-3 w-3': size === 'md',
              'h-4 w-4': size === 'lg',
            })}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.keys(variants)),
  size: PropTypes.oneOf(Object.keys(sizes)),
  className: PropTypes.string,
  rounded: PropTypes.bool,
  icon: PropTypes.node,
  removable: PropTypes.bool,
  onRemove: PropTypes.func,
}; 