import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import claimService from '../services/claimService';

export const claimKeys = {
    all: ['claims'],
};

export function useClaimsQuery() {
    const { isAuthenticated } = useAuth();
    return useQuery({
        queryKey: claimKeys.all,
        queryFn: async () => {
            const data = await claimService.getClaims();
            return Array.isArray(data) ? data : [];
        },
        enabled: isAuthenticated,
    });
}

export function useCreateClaim() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => claimService.createClaim(payload),
        onSuccess: (newClaim) => {
            queryClient.setQueryData(claimKeys.all, (old = []) => [newClaim, ...old]);
        },
    });
}

export function useUpdateClaimStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }) => claimService.updateClaimStatus(id, status),
        onSuccess: (updated, { id }) => {
            queryClient.setQueryData(claimKeys.all, (old = []) =>
                old.map((claim) => (claim.id === id ? updated : claim))
            );
        },
    });
}