import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }],
        }));

        // Auto remove
        const duration = toast.duration || 3000;
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }));
        }, duration);
    },
    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    },
    success: (message, duration) => {
        useToastStore.getState().addToast({ type: 'success', message, duration });
    },
    error: (message, duration) => {
        useToastStore.getState().addToast({ type: 'error', message, duration });
    }
}));

// Provide a pre-bound hook for easier exporting similar to other react-hot-toast libraries
export const useToast = () => {
    const { success, error, addToast, removeToast } = useToastStore();
    return { success, error, toast: addToast, dismiss: removeToast };
};
