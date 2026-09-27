import api from './api';

const CLAIM_ENDPOINTS = {
    BASE: '/api/claims',
};

class ClaimService {
    // GET /api/claims
    async getClaims() {
        const response = await api.get(CLAIM_ENDPOINTS.BASE);
        return response.data; // ClaimDTO[]
    }

    // POST /api/claims
    async createClaim(payload) {
        // payload: { deviceId, issue, details }
        const response = await api.post(CLAIM_ENDPOINTS.BASE, payload);
        return response.data; // ClaimDTO
    }

    // PATCH /api/claims/{id}?status=...
    async updateClaimStatus(id, status) {
        const response = await api.patch(`${CLAIM_ENDPOINTS.BASE}/${id}`, null, {
            params: { status },
        });
        return response.data; // ClaimDTO
    }
}

export default new ClaimService();