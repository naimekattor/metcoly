import { create } from 'zustand';
import Cookies from 'js-cookie';
import { authAPI } from '../lib/api/auth';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'SUPER_ADMIN' | 'CONSULTANT' | 'CLIENT';
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Initially true while we verify session on mount
    error: null,

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authAPI.login(credentials);
            Cookies.set('accessToken', response.data.accessToken, { path: '/' });
            Cookies.set('refreshToken', response.data.refreshToken, { path: '/' });

            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Login failed',
                isLoading: false,
                isAuthenticated: false
            });
            throw error;
        }
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authAPI.register(userData);
            Cookies.set('accessToken', response.data.accessToken, { path: '/' });
            Cookies.set('refreshToken', response.data.refreshToken, { path: '/' });

            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Registration failed',
                isLoading: false,
                isAuthenticated: false
            });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout failed on backend:', error);
        } finally {
            // Forcefully clear cookies
            Cookies.remove('accessToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });
            // Fallback for tricky domains
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        }
    },

    fetchUser: async () => {
        try {
            const response = await authAPI.getMe();
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error) {
            Cookies.remove('accessToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            set({
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    },

    clearError: () => set({ error: null })
}));

if (typeof window !== 'undefined') {
    window.addEventListener('auth:unauthorized', () => {
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        useAuthStore.setState({ user: null, isAuthenticated: false, error: 'Session expired. Please log in again.' });
    });
}
