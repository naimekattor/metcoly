import { apiClient } from '../axios';

export const bookingsAPI = {
    getAllBookings: async (params?: any) => {
        const response = await apiClient.get('/bookings', { params });
        return response.data;
    },
    getMyBookings: async (params?: any) => {
        const response = await apiClient.get('/bookings/my-bookings', { params });
        return response.data;
    },
    getBooking: async (id: string) => {
        const response = await apiClient.get(`/bookings/${id}`);
        return response.data;
    },
    createBooking: async (bookingData: any) => {
        const response = await apiClient.post('/bookings', bookingData);
        return response.data;
    },
    approveBooking: async (id: string) => {
        const response = await apiClient.patch(`/bookings/${id}/approve`);
        return response.data;
    },
    rejectBooking: async (id: string) => {
        const response = await apiClient.patch(`/bookings/${id}/reject`);
        return response.data;
    },
    completeBooking: async (id: string, meetingNotes?: string) => {
        const response = await apiClient.patch(`/bookings/${id}/complete`, { meetingNotes });
        return response.data;
    },
    markNoShow: async (id: string) => {
        const response = await apiClient.patch(`/bookings/${id}/no-show`);
        return response.data;
    }
};
