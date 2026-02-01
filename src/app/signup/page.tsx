"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Button from '@/components/ui/Button';
import SectionBackground from '@/components/ui/SectionBackground';
import { Icon } from '@iconify/react';
import { useToast } from "@/context/ToastContext";

export default function SignupPage() {
    const router = useRouter();
    const { register, isAuthenticated, user } = useAuthStore();
    const { success, error: toastError } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

        // Basic validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            const data = (await register(email, password)) as { data?: { user?: { role: string } } };
            const rawRole = data?.data?.user?.role || 'USER';
            const userRole = rawRole.toUpperCase();
            console.log(`[SignupPage] Registration successful. Role: ${userRole}. Redirecting...`);
            success(userRole === 'ADMIN'
                ? "Registration successful! Welcome to the admin dashboard."
                : "Registration successful! Welcome to Takeoff.");
            router.push(userRole === 'ADMIN' ? '/dashboard' : '/login');
        } catch (err) {
            // Improved error parsing
            let message = 'Registration failed. Please try again.';
            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'string') {
                message = err;
            }
            setError(message);
            toastError(message);
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
                            Create Account
                        </h1>
                        <p className="text-white/60">Sign up to access your dashboard</p>
                    </div>

                    {/* Signup Form */}
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
                                placeholder="Create a password"
                            />
                            <p className="text-xs text-white/40">Must contain at least 8 characters</p>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-4">
                            <label htmlFor="confirmPassword" className="block text-base font-medium text-white/90">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-white px-0 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-orange transition-colors rounded-none"
                                placeholder="Confirm your password"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm flex items-center gap-2">
                                <Icon icon="lucide:alert-circle" className="text-lg flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="accent"
                            className="w-full py-3 rounded-full font-semibold mt-8"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-white/60">
                            Already have an account?{' '}
                            <a href="/login" className="text-orange hover:text-white transition-colors font-medium">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </SectionBackground>
        </div>
    );
}
