// src/components/device/DeviceCard.jsx

import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Edit, Trash2, Clock } from 'lucide-react';
import { getDeviceIcon } from '../../utils/getDeviceIcon'; // ♻️ shared icon logic (was duplicated inline)

const statusConfig = {
  active: { label: 'Active', color: 'success' },
  'expiring-soon': { label: 'Expiring Soon', color: 'warning' },
  expired: { label: 'Expired', color: 'error' },
};

export function DeviceCard({ device, onDelete }) {
  const navigate = useNavigate();
  const DeviceIcon = getDeviceIcon(device);
  // const status = statusConfig[device.warrantyStatus] || { label: 'Unknown', color: 'default' };
  const normalizedStatusKey = (device.warrantyStatus || '').toLowerCase().replace(' ', '-');
  const status = statusConfig[normalizedStatusKey] || { label: 'Unknown', color: 'default' };


  const handleCardClick = () => {
    navigate(`/devices/${device.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    onDelete(device);
  };

  return (
      <div
          className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div onClick={handleCardClick} className="cursor-pointer">
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <DeviceIcon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
              </div>
              <Badge color={status.color} className="text-xs">{status.label}</Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={device.name}>
                {device.name || 'Unnamed Device'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {device.manufacturer || 'N/A'}
              </p>
            </div>
          </div>
          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2" />
              <span>Expires: {new Date(device.warrantyEndDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        {/* Hover Actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="icon" variant="ghost" onClick={handleDeleteClick} className="w-8 h-8">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
  );
}