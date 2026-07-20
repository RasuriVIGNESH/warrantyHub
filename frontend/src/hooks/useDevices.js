import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import deviceService from '../services/deviceService';

export function useDevices() {
  const { isAuthenticated } = useAuth();
  const [devices, setDevices] = useState([]);
  const [documents, setDocuments] = useState([]); // ✨ ADDED: State for a specific device's documents
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevices = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return [];
    }
    try {
      setLoading(true);
      setError(null);
      const data = await deviceService.getAllDevices();
      const deviceArray = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
      setDevices(deviceArray);
      return deviceArray;
    } catch (err) {
      setError(err.message || 'Failed to fetch devices');
      setDevices([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchDocuments = useCallback(async (deviceId) => {
    if (!isAuthenticated) return;
    try {
      const docs = await deviceService.getDocuments(deviceId);
      setDocuments(Array.isArray(docs) ? docs : []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setDocuments([]);
    }
  }, [isAuthenticated]);

  // Function to open a document using its external `fileUrl` (no backend call)
  const downloadDocument = async (document) => {
    try {
      if (document && document.fileUrl) {
        window.open(document.fileUrl, '_blank', 'noopener,noreferrer');
      } else {
        console.warn('Document has no fileUrl to open:', document);
      }
    } catch (err) {
      console.error('Failed to open document:', err);
    }
  };


  // Create a new device
  // ✨ MODIFIED: Now accepts an optional 'file' argument
  const createDevice = async (deviceData, file) => {
    try {
      setLoading(true);
      setError(null);
      
      // Step 1: Create the device with metadata
      const newDevice = await deviceService.createDevice(deviceData);
      
      // Step 2: If a file exists, upload it to the newly created device
      if (file && newDevice.id) {
        await deviceService.uploadDocument(newDevice.id, file);
      }

      // Add the new device to the local state
      setDevices(prev => [...prev, newDevice]);
      return newDevice;
    } catch (err) {
      setError(err.message || 'Failed to create device');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing device
  const updateDevice = async (deviceId, deviceData) => {
    try {
      const updatedDevice = await deviceService.updateDevice(deviceId, deviceData);
      // Update the device in the main list
      setDevices(prev =>
        prev.map(device =>
          device.id === deviceId ? { ...device, ...updatedDevice } : device
        )
      );
      // Return the updated device data to refresh the details view
      return updatedDevice;
    } catch (err) {
      console.error('Failed to update device:', err);
      // You can also set an error state here
      throw err; // Re-throw error to be caught in the component
    }
  };
  const uploadDocuments = async (deviceId, files) => {
    try {
      // Create an array of upload promises
      const uploadPromises = files.map(file => deviceService.uploadDocument(deviceId, file));
      
      // Wait for all files to upload
      await Promise.all(uploadPromises);
      
      // After all uploads are successful, refresh the document list
      await fetchDocuments(deviceId);
    } catch (err) {
      console.error('Failed to upload documents:', err);
      throw err;
    }
  };

  // Add maintenance record
  const addMaintenanceRecord = async (deviceId, record) => {
    try {
      setLoading(true);
      setError(null);
      const updatedDevice = await deviceService.addMaintenanceRecord(deviceId, record);
      setDevices(prev =>
        prev.map(device =>
          device.id === deviceId ? updatedDevice : device
        )
      );
      return updatedDevice;
    } catch (err) {
      setError(err.message || 'Failed to add maintenance record');
      return null;
    } finally {
      setLoading(false);
    }
  };


  // Delete a device
  const deleteDevice = async (deviceId) => {
    try {
      setLoading(true);
      setError(null);
      await deviceService.deleteDevice(deviceId);
      setDevices(prev => prev.filter(device => device.id !== deviceId));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete device');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get devices by status
  const getDevicesByStatus = useCallback((status) => {
    return devices.filter(device => device.warrantyStatus === status);
  }, [devices]);

  const getDeviceById = useCallback((deviceId) => {
    return devices.find(device => device.id === deviceId);
  }, [devices]);

  // Load devices on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDevices();
    }
  }, [isAuthenticated, fetchDevices]);

  return {
    devices,
    documents, // ✨ EXPORT: Expose documents state
    loading,
    error,
    fetchDevices,
    createDevice,
    updateDevice,
    deleteDevice,
    addMaintenanceRecord,
    getDevicesByStatus,
    getDeviceById,
    fetchDocuments, // ✨ EXPORT: Expose new function
    downloadDocument, 
    uploadDocuments,// ✨ EXPORT: Expose new function
  };
}