import PropTypes from 'prop-types';
import { Package } from 'lucide-react';
import { DeviceCard } from './DeviceCard';
import { EmptyState } from '../ui/EmptyState';

export function DeviceGrid({ devices, onSelect, onEdit, onDelete, isLoading ,selectedDeviceId}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg h-48"
          />
        ))}
      </div>
    );
  }

  if (!devices?.length) {
    return (
      <EmptyState
        icon={Package}
        title="No devices found"
        description="Add your first device to start tracking warranties"
        action={{
          label: 'Add Device',
          onClick: () => onEdit(null),
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <DeviceCard
        key={device.id}
        device={device}
        onSelect={onSelect} // Changed from onEdit
        onDelete={onDelete}
        isSelected={device.id === selectedDeviceId} // Pass isSelected prop
      />
      ))}
    </div>
  );
}

DeviceGrid.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      brand: PropTypes.string.isRequired,
      purchaseDate: PropTypes.string.isRequired,
      warrantyEndDate: PropTypes.string,
      warrantyStatus: PropTypes.oneOf(['active', 'expiring-soon', 'expired', 'unknown']).isRequired,
      documents: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })),
    })
  ),
  onSelect: PropTypes.func.isRequired, // Changed from onEdit
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  selectedDeviceId: PropTypes.string,
}; 