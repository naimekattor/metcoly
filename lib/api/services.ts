import { apiClient } from '../axios';

export const servicesAPI = {
    getActiveServices: async () => {
        const response = await apiClient.get('/services');
        return response.data;
    },
};
