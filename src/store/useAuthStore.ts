import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '@/services/auth.service';
import { User } from '@/types/user.types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<unknown>;
    register: (email: string, password: string) => Promise<unknown>;
    logout: () => void;
    setUser: (user: User, token: string) => void;
    checkSession: () => Promise<void>;
    hydrated: boolean;
    setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                try {
                    const user = await AuthService.login(email, password);
                    set({
                        user,
                        isAuthenticated: true,
                        token: "cookie-handled"
                    });
                    return { data: { user } };
                } catch (error) {
                    console.error('Login error:', error);
                    throw error;
                }
            },

            register: async (email: string, password: string) => {
                try {
                    // Sign up endpoint (using fetch directly or we could add to AuthService if generic)
                    const response = await fetch('/api/auth/signup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.message || 'Registration failed');
                    }

                    set({
                        user: data.data.user,
                        isAuthenticated: true,
                        token: "cookie-handled"
                    });

                    return data;
                } catch (error) {
                    console.error('Registration error:', error);
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await AuthService.logout();
                } catch (error) {
                    console.error('Logout error:', error);
                }
                set({ user: null, isAuthenticated: false, token: null });
            },

            setUser: (user: User, token: string) => {
                set({ user, token, isAuthenticated: true });
            },

            checkSession: async () => {
                try {
                    const user = await AuthService.getCurrentUser();
                    set({
                        user,
                        isAuthenticated: true,
                        token: "cookie-handled"
                    });
                } catch {
                    set({ user: null, isAuthenticated: false, token: null });
                }
            },

            hydrated: false,
            setHydrated: () => set({ hydrated: true }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            }
        }
    )
);
