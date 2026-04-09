import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { Package, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';

function DeviceRow({ device }) {
  const warrantyStatusColors = {
    'active': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    'expiring-soon': 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    'expired': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    'unknown': 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20',
  };

  return (
    <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
          <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {device.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {device.manufacturer} - {device.model}
        </p>
      </div>
      <div className="flex-shrink-0">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${warrantyStatusColors[device.warrantyStatus]}`}>
          {device.warrantyStatus.replace('-', ' ')}
        </span>
      </div>
      <div className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
        {formatDistanceToNow(new Date(device.addedDate), { addSuffix: true })}
      </div>
    </div>
  );
}

DeviceRow.propTypes = {
  device: PropTypes.shape({
    name: PropTypes.string.isRequired,
    manufacturer: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    warrantyStatus: PropTypes.oneOf(['active', 'expiring-soon', 'expired', 'unknown']).isRequired,
    addedDate: PropTypes.string.isRequired,
  }).isRequired,
};

export function RecentDevices({ devices }) {
  // Sort and slice devices
  const sortedDevices = [...devices]
    .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
    .slice(0, 5);

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>Recently Added Devices</Card.Title>
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
      </Card.Header>
      <Card.Content>
        {sortedDevices.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No devices added recently.
            </p>
            {/* Optional: Add a call-to-action */}
            {/* <button
              onClick={() => navigate('/devices/new')}
              className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Add a new device
            </button> */}
          </div>
        ) : (
          <div className="space-y-1">
            {sortedDevices.map(device => (
              <DeviceRow key={device.id} device={device} />
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}

RecentDevices.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      manufacturer: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      warrantyStatus: PropTypes.oneOf(['active', 'expiring-soon', 'expired', 'unknown']).isRequired,
      addedDate: PropTypes.string.isRequired,
    })
  ).isRequired,
};
