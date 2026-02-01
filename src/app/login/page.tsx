"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Button from '@/components/ui/Button';
import SectionBackground from '@/components/ui/SectionBackground';
import { Icon } from '@iconify/react';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, user } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            const role = user.role?.toUpperCase();
            router.push(role === 'ADMIN' ? '/dashboard' : '/login');
        }
    }, [isAuthenticated, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = (await login(email, password)) as { data?: { user?: { role: string } }; user?: { role: string } };
            const rawRole = response?.data?.user?.role || response?.user?.role || 'USER';
            const userRole = rawRole.toUpperCase();
            console.log(`[LoginPage] Login successful. Role: ${userRole}. Redirecting...`);
            router.push(userRole === 'ADMIN' ? '/dashboard' : '/login');
        } catch (err) {
            // Improved error parsing
            let message = 'Login failed. Please try again.';
            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'string') {
                message = err;
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-[calc(100vh-theme(spacing.32))]">
            <SectionBackground className="flex-1 flex flex-col justify-center items-center pt-40 pb-20 px-6">
                <div className="w-full max-w-md mx-auto">
                    {/* Logo/Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                            Welcome Back
                        </h1>
                        <p className="text-white/60">Sign in to access your dashboard</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Email */}
                        <div className="space-y-4">
                            <label htmlFor="email" className="block text-base font-medium text-white/90">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-white px-0 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-orange transition-colors rounded-none"
                                placeholder="your@email.com"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-4">
                            <label htmlFor="password" className="block text-base font-medium text-white/90">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-white px-0 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-orange transition-colors rounded-none"
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm flex items-center gap-2">
                                <Icon icon="tabler:alert-triangle" className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="accent"
                            className="w-full py-3 rounded-full font-semibold mt-8"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                        <p className="text-white/60">
                            Don&apos;t have an account?{' '}
                            <a href="/signup" className="text-orange hover:text-white transition-colors font-medium">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </SectionBackground>
        </div>
    );
}
