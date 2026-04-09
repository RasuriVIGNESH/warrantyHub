import PropTypes from 'prop-types';
import { Filter } from 'lucide-react';
import { DEVICE_TYPES } from '../../utils/warrantyUtils';

const WARRANTY_STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'expiring-soon', label: 'Expiring Soon' },
  { value: 'expired', label: 'Expired' },
];

export function DeviceFilters({ filters, onChange }) {
  const handleFilterChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Device Type
        </label>
        <div className="relative">
          <select
            value={filters.type || 'all'}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {Object.entries(DEVICE_TYPES).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Warranty Status
        </label>
        <div className="relative">
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {WARRANTY_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Sort By
        </label>
        <div className="relative">
          <select
            value={filters.sortBy || 'warrantyEndDate'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="warrantyEndDate">Warranty End Date</option>
            <option value="purchaseDate">Purchase Date</option>
            <option value="name">Name</option>
            <option value="brand">Brand</option>
          </select>
        </div>
      </div>

      {Object.values(filters).some((value) => value !== 'all' && value !== 'warrantyEndDate') && (
        <button
          onClick={() => onChange({
            type: 'all',
            status: 'all',
            sortBy: 'warrantyEndDate',
          })}
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Filter className="h-4 w-4 mr-2" />
          Reset Filters
        </button>
      )}
    </div>
  );
}

DeviceFilters.propTypes = {
  filters: PropTypes.shape({
    type: PropTypes.string,
    status: PropTypes.string,
    sortBy: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}; 