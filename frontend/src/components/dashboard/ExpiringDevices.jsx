import PropTypes from 'prop-types';
import { formatDistanceToNow, format } from 'date-fns';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';

function ExpiringDeviceRow({ device }) {
  const daysUntilExpiry = Math.ceil(
    (new Date(device.warrantyEndDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {device.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Expires {format(new Date(device.warrantyEndDate), 'MMM d, yyyy')}
        </p>
      </div>
      <div className="flex-shrink-0">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
          {daysUntilExpiry} days left
        </span>
      </div>
      <div className="flex-shrink-0">
        <button
          className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          onClick={() => {/* Navigate to device details */}}
        >
          <ArrowRight className="h-5 w-5" />
          <span className="sr-only">View device details</span>
        </button>
      </div>
    </div>
  );
}

ExpiringDeviceRow.propTypes = {
  device: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    warrantyEndDate: PropTypes.string.isRequired,
  }).isRequired,
};

export function ExpiringDevices({ devices }) {
  // Filter and sort devices by warranty end date
  const expiringDevices = devices
    .filter(device => {
      const daysUntilExpiry = Math.ceil(
        (new Date(device.warrantyEndDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    })
    .sort((a, b) => new Date(a.warrantyEndDate) - new Date(b.warrantyEndDate))
    .slice(0, 5); // Show only 5 most urgent devices

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div>
            <Card.Title>Expiring Warranties</Card.Title>
            <Card.Description>Devices with warranties expiring in the next 30 days</Card.Description>
          </div>
          <div className="flex items-center justify-center w-8 h-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="space-y-1">
          {expiringDevices.map(device => (
            <ExpiringDeviceRow key={device.id} device={device} />
          ))}
          {expiringDevices.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No warranties expiring soon
            </p>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}

ExpiringDevices.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      warrantyEndDate: PropTypes.string.isRequired,
    })
  ).isRequired,
}; 