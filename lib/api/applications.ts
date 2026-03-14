import { apiClient } from '../axios';

export const applicationsAPI = {
    getAllApplications: async (params?: any) => {
        const response = await apiClient.get('/applications', { params });
        return response.data;
    },
    getMyApplications: async (params?: any) => {
        const response = await apiClient.get('/applications/my-applications', { params });
        return response.data;
    },
    getConsultantApplications: async (params?: any) => {
        const response = await apiClient.get('/applications/consultant', { params });
        return response.data;
    },
    getApplication: async (id: string) => {
        const response = await apiClient.get(`/applications/${id}`);
        return response.data;
    },
    createApplication: async (applicationData: any) => {
        const response = await apiClient.post('/applications', applicationData);
        return response.data;
    },
    updateApplication: async (id: string, updateData: any) => {
        const response = await apiClient.patch(`/applications/${id}`, updateData);
        return response.data;
    },
    submitApplication: async (id: string) => {
        const response = await apiClient.patch(`/applications/${id}/submit`);
        return response.data;
    },
    updateStatus: async (id: string, status: string, reason?: string) => {
        const response = await apiClient.patch(`/applications/${id}/status`, { status, reason });
        return response.data;
    },
    assignConsultant: async (id: string, consultantId: string) => {
        const response = await apiClient.post(`/applications/${id}/assign`, { consultantId });
        return response.data;
    },
    addNote: async (id: string, content: string) => {
        const response = await apiClient.post(`/applications/${id}/notes`, { content });
        return response.data;
    }
};
