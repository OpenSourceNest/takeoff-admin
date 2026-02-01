import { ApiService } from './api.service';
import { AuthResponse, User } from '@/types/user.types';

export class AuthService extends ApiService {
    /**
     * Authenticate user and obtain session
     */
    static async login(email: string, password: string): Promise<User> {
        const response = await this.fetchJson<AuthResponse['data']>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        return response.user;
    }

    /**
     * Get currently authenticated user session
     */
    static async getCurrentUser(): Promise<User> {
        const response = await this.fetchJson<AuthResponse['data']>('/api/auth/me', {
            method: 'GET'
        });
        return response.user;
    }

    /**
     * Terminate user session
     */
    static async logout(): Promise<void> {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('[AuthService] Logout failed', error);
        }
    }
}
