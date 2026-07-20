import { useState, useCallback, useEffect } from 'react';
import deviceService from '../services/deviceService';
import { useAuth } from './useAuth';

/**
 * Hook for fetching the ENTIRE list of devices.
 * This should be used by your main `/devices` page.
 */
export function useDevicesList() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchDevices = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await deviceService.getAllDevices();
      // The API response nests the array under a "devices" key
      setDevices(data.devices || []);
    } catch (err) {
      setError(err.message);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Expose a function to allow deleting from the list view
  const deleteDevice = async (deviceId) => {
    try {
      await deviceService.deleteDevice(deviceId);
      // Refetch the list to show the change
      await fetchDevices();
    } catch (err) {
      console.error("Failed to delete device:", err);
      throw err;
    }
  };

  return { devices, loading, error, deleteDevice };
}


/**
 * Hook for fetching and managing a SINGLE device and its related data.
 * This should be used by your `/devices/:id` detail page.
 */
export function useDeviceDetail(deviceId) {
  const [device, setDevice] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !deviceId || isAuthLoading) {
      if (!isAuthLoading) setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Fetch the specific device and its documents in parallel for performance
      const [deviceData, documentsData] = await Promise.all([
        deviceService.getDeviceById(deviceId),
        deviceService.getDocuments(deviceId)
      ]);
      setDevice(deviceData);
      setDocuments(documentsData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, deviceId,  isAuthLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to update the device
  const updateDevice = async (deviceData) => {
    try {
      const updated = await deviceService.updateDevice(deviceId, deviceData);
      setDevice(updated); // Update local state with the response from the server
      return updated;
    } catch (err) {
      console.error("Failed to update device:", err);
      throw err;
    }
  };
  
  // Function to upload new documents
  const uploadDocuments = async (files) => {
    try {
      const uploadPromises = files.map(file => deviceService.uploadDocument(deviceId, file));
      await Promise.all(uploadPromises);
      // After upload, refetch the documents list to show the new ones
      const newDocuments = await deviceService.getDocuments(deviceId);
      setDocuments(newDocuments || []);
    } catch (err) {
      console.error("Failed to upload documents:", err);
      throw err;
    }
  };

  // Function to open a document using its external `fileUrl` (no backend call)
  const downloadDocument = async (document) => {
    try {
      if (document && document.fileUrl) {
        window.open(document.fileUrl, '_blank', 'noopener,noreferrer');
      } else {
        console.warn('Document has no fileUrl to open:', document);
        alert('Document URL is not available.');
      }
    } catch (err) {
      console.error('Failed to open document:', err);
      alert('Failed to open document. Please try again.');
      throw err;
    }
  };

  return { 
    device, 
    documents, 
    loading, 
    error,
    refetch: fetchData,
    updateDevice, 
    uploadDocuments,
    downloadDocument 
  };
}