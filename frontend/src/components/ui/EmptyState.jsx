import PropTypes from 'prop-types';
import { clsx } from 'clsx';

export function EmptyState({
  title,
  description,
  icon,
  action,
  image,
  className,
  size = 'default',
}) {
  const sizes = {
    compact: {
      wrapper: 'py-8',
      icon: 'h-8 w-8',
      image: 'h-32',
      title: 'text-lg',
      description: 'text-sm',
    },
    default: {
      wrapper: 'py-12',
      icon: 'h-12 w-12',
      image: 'h-48',
      title: 'text-xl',
      description: 'text-base',
    },
    large: {
      wrapper: 'py-16',
      icon: 'h-16 w-16',
      image: 'h-64',
      title: 'text-2xl',
      description: 'text-lg',
    },
  };

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center px-4',
        sizes[size].wrapper,
        className
      )}
    >
      {icon && (
        <div
          className={clsx(
            'text-gray-400 mb-4',
            sizes[size].icon
          )}
        >
          {icon}
        </div>
      )}
      
      {image && (
        <div
          className={clsx(
            'mb-4 flex items-center justify-center',
            sizes[size].image
          )}
        >
          {typeof image === 'string' ? (
            <img
              src={image}
              alt={title}
              className="max-h-full"
            />
          ) : (
            image
          )}
        </div>
      )}

      {title && (
        <h3
          className={clsx(
            'font-semibold text-gray-900 mb-1',
            sizes[size].title
          )}
        >
          {title}
        </h3>
      )}

      {description && (
        <p
          className={clsx(
            'text-gray-500 max-w-sm mb-4',
            sizes[size].description
          )}
        >
          {description}
        </p>
      )}

      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.node,
  action: PropTypes.node,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  size: PropTypes.oneOf(['compact', 'default', 'large']),
}; 