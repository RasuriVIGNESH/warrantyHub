import api from './api';

const FILE_ENDPOINTS = {
  UPLOAD: '/api/files/upload',
  DOWNLOAD: '/api/files/download',
  DELETE: '/api/files/delete',
};

class FileService {
  async uploadFile(file, deviceId) {
    const formData = new FormData();
    formData.append('file', file);
    if (deviceId) {
      formData.append('deviceId', deviceId);
    }

    const response = await api.post(FILE_ENDPOINTS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadMultipleFiles(files, deviceId) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (deviceId) {
      formData.append('deviceId', deviceId);
    }

    const response = await api.post(FILE_ENDPOINTS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async downloadFile(fileId) {
    const response = await api.get(`${FILE_ENDPOINTS.DOWNLOAD}/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async deleteFile(fileId) {
    const response = await api.delete(`${FILE_ENDPOINTS.DELETE}/${fileId}`);
    return response.data;
  }

  // Helper method to trigger file download
  downloadBlob(blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

export default new FileService(); 