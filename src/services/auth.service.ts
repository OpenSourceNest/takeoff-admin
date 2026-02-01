import { apiClient } from '@/lib/apiClient';
import { AuthResponse, User } from '@/types/user.types';

export class AuthService {
    /**
     * Authenticate user and obtain session
     */
    static async login(email: string, password: string): Promise<User> {
        const response = await apiClient.post<AuthResponse>('/api/auth/login', { email, password });
        return response.data.user;
    }

    /**
     * Get currently authenticated user session
     */
    static async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<AuthResponse>('/api/auth/me');
        return response.data.user;
    }

    /**
     * Terminate user session
     */
    static async logout(): Promise<void> {
        try {
            await apiClient.post('/api/auth/logout', {});
        } catch (error) {
            console.error('[AuthService] Logout failed', error);
        }
    }
}
