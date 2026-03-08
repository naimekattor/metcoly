import { useAuthStore } from '../store/authStore';

type Role = 'SUPER_ADMIN' | 'CONSULTANT' | 'CLIENT';

export const useRole = () => {
    const { user, isAuthenticated, isLoading } = useAuthStore();

    const hasRole = (roles: Role | Role[]) => {
        if (!isAuthenticated || !user) return false;

        if (Array.isArray(roles)) {
            return roles.includes(user.role as Role);
        }
        return user.role === roles;
    };

    return {
        isSuperAdmin: hasRole('SUPER_ADMIN'),
        isConsultant: hasRole('CONSULTANT'),
        isClient: hasRole('CLIENT'),
        isAdminOrConsultant: hasRole(['SUPER_ADMIN', 'CONSULTANT']),
        hasRole,
        role: user?.role,
        isLoading
    };
};
