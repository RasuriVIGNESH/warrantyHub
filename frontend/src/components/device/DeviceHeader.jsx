// src/components/device/DeviceHeader.jsx

import { Package, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useDevices } from '../../hooks/useDevices'; // Import the hook
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  active: { label: 'Active', color: 'success' },
  'expiring-soon': { label: 'Expiring Soon', color: 'warning' },
  expired: { label: 'Expired', color: 'error' },
};

export function DeviceHeader({ device, onEditClick }) {
  const navigate = useNavigate();
  const { deleteDevice } = useDevices(); // Get the delete function
  // const status = statusConfig[device.warrantyStatus] || { label: 'Unknown', color: 'default' };
  const normalizedStatusKey = (device.warrantyStatus || '').toLowerCase().replace(' ', '-');
  const status = statusConfig[normalizedStatusKey] || { label: 'Unknown', color: 'default' };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${device.name}? This action is irreversible.`)) {
      try {
        await deleteDevice(device.id);
        navigate('/devices'); // Navigate back to the list after deletion
      } catch (error) {
        console.error("Failed to delete device:", error);
        // Optionally show an error notification
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Package className="w-8 h-8 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{device.name}</h1>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <Badge color={status.color}>
              {status.label}
            </Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              • Warranty ends {new Date(device.warrantyEndDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
        </Button>
        <Button variant="outline" onClick={onEditClick}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Device
        </Button>
      </div>
    </div>
  );
}