import api from './api';

const DEVICE_ENDPOINTS = {
  BASE: '/api/devices', 
  CATEGORIES: '/api/devices/categories', 
  SEARCH: '/api/devices/search',  
  STATS: '/api/devices/stats',         
};
class DeviceService {

  // Document management methods
    async uploadDocument(deviceId, file) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(`${DEVICE_ENDPOINTS.BASE}/${deviceId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    async getDocuments(deviceId) {
      const response = await api.get(`${DEVICE_ENDPOINTS.BASE}/${deviceId}/documents`);
      return response.data;
    }

    // Note: single-document GET and DELETE endpoints were removed from the backend.
    // Document files are hosted externally (e.g. Cloudinary) and the `fileUrl`
    // returned by `getDocuments` should be used directly in the frontend.
  async getAllDevices(params = {}) {
    const response = await api.get(DEVICE_ENDPOINTS.BASE, { params });
    return response.data;
  }

  async getDeviceById(id) {
    const response = await api.get(`${DEVICE_ENDPOINTS.BASE}/${id}`);
    return response.data;
  }

  async createDevice(deviceData) {
    const response = await api.post(`${DEVICE_ENDPOINTS.BASE}/new`, deviceData);
    return response.data;
  }
  
  async updateDevice(id, deviceData) {
    const response = await api.put(`${DEVICE_ENDPOINTS.BASE}/${id}`, deviceData);
    return response.data;
  }

  async deleteDevice(id) {
    const response = await api.delete(`${DEVICE_ENDPOINTS.BASE}/${id}`);
    return response.data;
  }

  async getCategories() {
    const response = await api.get(DEVICE_ENDPOINTS.CATEGORIES);
    return response.data;
  }

  async searchDevices(query) {
    const response = await api.get(DEVICE_ENDPOINTS.SEARCH, {
      params: { query }
    });
    return response.data;
  }

  async getDeviceStats() {
    const response = await api.get(DEVICE_ENDPOINTS.STATS);
    return response.data;
  }

  async updateDeviceStatus(id, status) {
    const response = await api.patch(`${DEVICE_ENDPOINTS.BASE}/${id}/status`, { status });
    return response.data;
  }

  // Maintenance management methods
    async getMaintenanceRecords(deviceId) {
      const response = await api.get(`${DEVICE_ENDPOINTS.BASE}/${deviceId}/maintenance`);
      return response.data;
    }

    async addMaintenanceRecord(deviceId, recordData) {
      const response = await api.post(`${DEVICE_ENDPOINTS.BASE}/${deviceId}/maintenance`, recordData);
      return response.data;
    }

    async updateMaintenanceRecord(deviceId, recordId, recordData) {
      const response = await api.put(`${DEVICE_ENDPOINTS.BASE}/${deviceId}/maintenance/${recordId}`, recordData);
      return response.data;
    }

    async deleteMaintenanceRecord(deviceId, recordId) {
      const response = await api.delete(`${DEVICE_ENDPOINTS.BASE}/${deviceId}/maintenance/${recordId}`);
      return response.data;
    }
}

export default new DeviceService(); 