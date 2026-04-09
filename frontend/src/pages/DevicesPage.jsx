// src/pages/DevicesPage.jsx

import { useState, useMemo } from 'react';
import { useDevices } from '../hooks/useDevices'; // Assuming your hook is here
import { DeviceGrid } from '../components/device/DeviceGrid';
import { DeviceDetails } from '../components/device/DeviceDetails';
import { DeviceSearch } from '../components/device/DeviceSearch';
import { DeviceFilters } from '../components/device/DeviceFilters';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { PlusCircle, Package } from 'lucide-react';

export function DevicesPage() {
  // === STATE MANAGEMENT ===
  const { 
    devices, 
    loading, 
    error, 
    createDevice, 
    updateDevice, 
    deleteDevice 
  } = useDevices();
  
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    sortBy: 'warrantyEndDate',
  });

  // === DERIVED STATE & FILTERING LOGIC ===
  const filteredDevices = useMemo(() => {
    let result = [...devices];

    // Search logic
    if (searchTerm) {
      result = result.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter logic
    if (filters.type !== 'all') {
      result = result.filter(d => d.type === filters.type);
    }
    if (filters.status !== 'all') {
      result = result.filter(d => d.warrantyStatus === filters.status);
    }

    // Sorting logic
    result.sort((a, b) => {
      if (filters.sortBy === 'name' || filters.sortBy === 'brand') {
        return a[filters.sortBy].localeCompare(b[filters.sortBy]);
      }
      return new Date(a[filters.sortBy]) - new Date(b[filters.sortBy]);
    });

    return result;
  }, [devices, searchTerm, filters]);

  // === EVENT HANDLERS ===
  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    setIsEditing(false); // Always start in view mode
  };

  const handleAddNew = () => {
    // For a form-based creation, you would handle it here.
    // This example focuses on the master-detail view.
    // You could navigate to your AddDevice page or open a modal.
    console.log("Add new device flow started");
    // navigate('/devices/new'); // Example navigation
  };
  
  const handleDelete = async () => {
    if (selectedDevice && window.confirm(`Are you sure you want to delete ${selectedDevice.name}?`)) {
      await deleteDevice(selectedDevice.id);
      setSelectedDevice(null);
    }
  };

  const handleUpdate = async (updatedData) => {
    if (selectedDevice) {
      const result = await updateDevice(selectedDevice.id, updatedData);
      setSelectedDevice(result); // Update selected device with new data from API
    }
  };

  const handleUploadFiles = (files) => {
    console.log(`Uploading ${files.length} files for device ${selectedDevice?.name}`);
    // Implement the actual API call logic here, likely in useDevices hook
  };
  
  const handleDeleteFile = (fileId) => {
    console.log(`Deleting file ${fileId} from device ${selectedDevice?.name}`);
    // Implement the actual API call logic here
  };


  // === RENDER LOGIC ===
  return (
    <div className="flex h-[calc(100vh-theme-header-height)]">
      {/* Left Column: Device List */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r dark:border-gray-700 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Your Devices</h1>
          <Button size="sm" onClick={handleAddNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
        <DeviceSearch onSearch={setSearchTerm} />
        <DeviceFilters filters={filters} onChange={setFilters} />
        <DeviceGrid 
          devices={filteredDevices}
          isLoading={loading}
          onSelect={handleSelectDevice} // Changed from onEdit to onSelect
          selectedDeviceId={selectedDevice?.id}
        />
      </div>

      {/* Right Column: Device Details */}
      <div className="hidden md:block md:w-2/3 lg:w-3/4 overflow-y-auto p-6">
        {selectedDevice ? (
          <DeviceDetails 
            key={selectedDevice.id} // Add key to force re-render on device change
            device={selectedDevice}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onUploadFiles={handleUploadFiles}
            onDeleteFile={handleDeleteFile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <EmptyState 
              icon={Package}
              title="Select a device"
              description="Choose a device from the list to see its details."
            />
          </div>
        )}
      </div>
    </div>
  );
}