// src/pages/Devices.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Loader2, Trash2, Clock } from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { getDeviceIcon } from '../utils/getDeviceIcon';

const DEVICE_STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'expiring-soon', label: 'Expiring Soon' },
  { value: 'expired', label: 'Expired' },
];

const statusConfig = {
  active: { label: 'Active', color: 'success' },
  'expiring-soon': { label: 'Expiring Soon', color: 'warning' },
  expired: { label: 'Expired', color: 'error' },
};

// 🔽 Local sub-component: only used on this page, so it lives here instead of its own file.
function DeviceCard({ device, onDelete }) {
  const navigate = useNavigate();
  const DeviceIcon = getDeviceIcon(device);
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
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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

export function Devices() {
  const navigate = useNavigate();
  const { devices, loading, error, deleteDevice } = useDevices();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const filteredDevices = devices.filter(device => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (device.name || '').toLowerCase().includes(searchLower) ||
      (device.manufacturer || '').toLowerCase().includes(searchLower) ||
      (device.model || '').toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || device.warrantyStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (deviceId) => {
    try {
      await deleteDevice(deviceId);
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Failed to delete device:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-center"><h3 className="text-lg font-medium">Error loading devices</h3><p className="mt-1 text-sm text-gray-500">{error}</p></div></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your Devices
        </h1>
        <Button onClick={() => navigate('/devices/new')} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Add Device
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, brand, model..."
            className="pl-12 w-full h-12 text-base"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={DEVICE_STATUS_OPTIONS}
          className="w-full sm:w-48 h-12 text-base"
        />
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete "{deleteConfirmation.name}"? This is irreversible.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setDeleteConfirmation(null)} className="flex-1">Cancel</Button>
                <Button variant="destructive" onClick={() => handleDelete(deleteConfirmation.id)} className="flex-1">Delete</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ✨ Modern Grid Layout ✨ */}
      {filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDevices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              onDelete={() => setDeleteConfirmation(device)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No Devices Found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {searchQuery || statusFilter !== 'all' ? "Try adjusting your search or filters." : "Click 'Add Device' to get started."}
          </p>
        </div>
      )}
    </div>
  );
}