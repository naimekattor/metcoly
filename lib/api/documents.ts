import { apiClient } from '../axios';

export const documentsAPI = {
    uploadDocument: async (file: File, applicationId: string, documentType: string) => {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('applicationId', applicationId);
        formData.append('documentType', documentType);

        // Override Content-Type headers letting browser set the correct multipart/form-data boundary
        const response = await apiClient.post('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    getApplicationDocuments: async (applicationId: string) => {
        const response = await apiClient.get(`/documents/application/${applicationId}`);
        return response.data;
    },
    downloadDocument: async (id: string) => {
        const response = await apiClient.get(`/documents/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },
    deleteDocument: async (id: string) => {
        const response = await apiClient.delete(`/documents/${id}`);
        return response.data;
    },
    getDocumentVersions: async (id: string) => {
        const response = await apiClient.get(`/documents/${id}/versions`);
        return response.data;
    }
};
