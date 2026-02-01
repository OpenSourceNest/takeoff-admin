export type UserRole = 'ADMIN' | 'USER';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
        token: string;
    };
    message?: string;
}
