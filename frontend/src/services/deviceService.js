import api from './api';

// Endpoints exactly as documented in the WarrantyHub swagger doc
// (Device Management, Document Management, Maintenance Management tags)
const DEVICE_ENDPOINTS = {
  BASE: '/api/devices',
};

class DeviceService {
  // ---- Device Management ----------------------------------------------

  // GET /api/devices
  async getAllDevices() {
    const response = await api.get(DEVICE_ENDPOINTS.BASE);
    return response.data; // { devices: [...] }
  }

  // GET /api/devices/{id}
  async getDeviceById(id) {
    const response = await api.get(`${DEVICE_ENDPOINTS.BASE}/${id}`);
    return response.data; // DeviceDTO
  }

  // POST /api/devices/new
  async createDevice(deviceData) {
    const response = await api.post(DEVICE_ENDPOINTS.BASE, deviceData);
    return response.data; // DeviceDTO
  }

  // PUT /api/devices/{id}
  async updateDevice(id, deviceData) {
    const response = await api.put(`${DEVICE_ENDPOINTS.BASE}/${id}`, deviceData);
    return response.data; // DeviceDTO
  }

  // DELETE /api/devices/{id}
  async deleteDevice(id) {
    const response = await api.delete(`${DEVICE_ENDPOINTS.BASE}/${id}`);
    return response.data; // ApiResponse
  }

  // ---- Document Management ----------------------------------------------

  // GET /api/devices/{deviceId}/documents
  async getDocuments(deviceId) {
    const response = await api.get(`${DEVICE_ENDPOINTS.BASE}/${deviceId}/documents`);
    return response.data; // DocumentDTO[]
  }

  // POST /api/devices/{deviceId}/documents (multipart/form-data, max 3 docs/device, 10MB max)
  async uploadDocument(deviceId, file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(
      `${DEVICE_ENDPOINTS.BASE}/${deviceId}/documents`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data; // DocumentDTO
  }

  // DELETE /api/devices/{deviceId}/documents/{documentId}
  async deleteDocument(deviceId, documentId) {
    const response = await api.delete(
      `${DEVICE_ENDPOINTS.BASE}/${deviceId}/documents/${documentId}`
    );
    return response.data; // ApiResponse
  }

  // ---- Maintenance Management --------------------------------------------
  // Note: there is no GET-all-maintenance-records endpoint in the swagger doc;
  // maintenance records are returned as part of the device (device.maintenanceHistory).

  // POST /api/devices/{deviceId}/maintenance
  async addMaintenanceRecord(deviceId, recordData) {
    // recordData: { date, type, description, cost, serviceProvider, partsReplaced, nextScheduledDate }
    const response = await api.post(`${DEVICE_ENDPOINTS.BASE}/${deviceId}/maintenance`, recordData);
    return response.data; // DeviceDTO (updated device, including the new record)
  }

  // PUT /api/devices/{deviceId}/maintenance/{recordId}
  async updateMaintenanceRecord(deviceId, recordId, recordData) {
    const response = await api.put(
      `${DEVICE_ENDPOINTS.BASE}/${deviceId}/maintenance/${recordId}`,
      recordData
    );
    return response.data; // DeviceDTO
  }

  // DELETE /api/devices/{deviceId}/maintenance/{recordId}
  async deleteMaintenanceRecord(deviceId, recordId) {
    const response = await api.delete(
      `${DEVICE_ENDPOINTS.BASE}/${deviceId}/maintenance/${recordId}`
    );
    return response.data; // ApiResponse
  }
}

export default new DeviceService();