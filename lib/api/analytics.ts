import { apiClient } from '../axios';

export const analyticsAPI = {
    getDashboardStats: async () => {
        const response = await apiClient.get('/analytics/dashboard');
        return response.data;
    },
    getRevenueAnalytics: async (params?: any) => {
        const response = await apiClient.get('/analytics/revenue', { params });
        return response.data;
    },
    getApplicationAnalytics: async (params?: any) => {
        const response = await apiClient.get('/analytics/applications', { params });
        return response.data;
    },
    getConsultantPerformance: async (params?: any) => {
        const response = await apiClient.get('/analytics/consultants/performance', { params });
        return response.data;
    },
    getActivityLogs: async (params?: any) => {
        const response = await apiClient.get('/analytics/logs', { params });
        return response.data;
    }
};
