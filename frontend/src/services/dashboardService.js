import api from './api';

class DashboardService {
    async getDashboard() {
        const response = await api.get('/api/dashboard');
        return response.data; // DashboardDTO
    }
}

export default new DashboardService();