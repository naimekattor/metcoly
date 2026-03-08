import { apiClient } from '../axios';

export const usersAPI = {
    getAllUsers: async (params?: any) => {
        const response = await apiClient.get('/users', { params });
        return response.data;
    },
    getUser: async (id: string) => {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },
    createConsultant: async (consultantData: any) => {
        const response = await apiClient.post('/users/consultant', consultantData);
        return response.data;
    },
    updateProfile: async (profileData: any) => {
        const response = await apiClient.patch('/users/profile', profileData);
        return response.data;
    },
    deactivateUser: async (id: string) => {
        const response = await apiClient.patch(`/users/${id}/deactivate`);
        return response.data;
    },
    activateUser: async (id: string) => {
        const response = await apiClient.patch(`/users/${id}/activate`);
        return response.data;
    }
};
