import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import dashboardService from '../services/dashboardService';

export const dashboardKeys = {
    all: ['dashboard'],
};

export function useDashboardQuery() {
    const { isAuthenticated } = useAuth();
    return useQuery({
        queryKey: dashboardKeys.all,
        queryFn: () => dashboardService.getDashboard(),
        enabled: isAuthenticated,
        staleTime: 60_000,
    });
}