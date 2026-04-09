import PropTypes from 'prop-types';
import { clsx } from 'clsx';

const variants = {
  flat: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
  elevated: 'bg-white dark:bg-gray-900 shadow-md',
  outlined: 'border-2 border-gray-200 dark:border-gray-700',
};

export function Card({
  children,
  className = '',
  variant = 'flat',
  padding = 'default',
  hover = false,
  clickable = false,
  onClick,
}) {
  const baseStyles = 'rounded-lg transition-all duration-200';
  
  const paddingStyles = {
    none: '',
    small: 'p-2',
    default: 'p-4',
    large: 'p-6',
  };

  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';
  const clickableStyles = clickable ? 'cursor-pointer' : '';

  return (
    <div
      className={clsx(
        baseStyles,
        variants[variant],
        paddingStyles[padding],
        hoverStyles,
        clickableStyles,
        className
      )}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// Header subcomponent
function CardHeader({ children, className }) {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  );
}

// Title subcomponent
function CardTitle({ children, className }) {
  return (
    <h3 className={clsx('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
}

// Description subcomponent
function CardDescription({ children, className }) {
  return (
    <p className={clsx('mt-1 text-sm text-gray-500', className)}>
      {children}
    </p>
  );
}

// Content subcomponent
function CardContent({ children, className }) {
  return (
    <div className={clsx('text-gray-700', className)}>
      {children}
    </div>
  );
}

// Footer subcomponent
function CardFooter({ children, className }) {
  return (
    <div className={clsx('mt-4 flex items-center justify-end space-x-2', className)}>
      {children}
    </div>
  );
}

// PropTypes
Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(Object.keys(variants)),
  padding: PropTypes.oneOf(['none', 'small', 'default', 'large']),
  hover: PropTypes.bool,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// Export subcomponents
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter; 