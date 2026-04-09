import PropTypes from 'prop-types';

export function Input({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = '',
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
      {...props}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
}; 