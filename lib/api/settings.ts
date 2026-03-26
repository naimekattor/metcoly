import { apiClient } from '../axios';

export const settingsAPI = {
  getSetting: async (key: string) => {
    const response = await apiClient.get(`/settings/${key}`);
    return response.data;
  },
  updateSetting: async (key: string, value: string) => {
    const response = await apiClient.patch(`/settings/${key}`, { value });
    return response.data;
  }
};
