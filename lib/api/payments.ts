import { apiClient } from '../axios';

export const paymentsAPI = {
    createSession: async (data: { applicationId?: string, bookingId?: string, paymentType: string }) => {
        const response = await apiClient.post('/payments/create-session', data);
        return response.data;
    },
    getMyPayments: async () => {
        const response = await apiClient.get('/payments/my-payments');
        return response.data;
    },
    getPaymentStatus: async (id: string) => {
        const response = await apiClient.get(`/payments/${id}`);
        return response.data;
    },
    getAllPayments: async (params?: any) => {
        const response = await apiClient.get('/payments', { params });
        return response.data;
    },
    refundPayment: async (id: string, refundData: any) => {
        const response = await apiClient.post(`/payments/${id}/refund`, refundData);
        return response.data;
    },
    verifySession: async (sessionId: string) => {
        const response = await apiClient.get(`/payments/verify-session/${sessionId}`);
        return response.data;
    }
};
