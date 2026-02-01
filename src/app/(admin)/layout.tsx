"use client";

import Image from 'next/image';
import Link from 'next/link';
import AdminLoading from '@/components/ui/AdminLoading';
import Sidebar from '@/components/admin/Sidebar';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { checkSession, isAuthenticated, user, hydrated } = useAuthStore();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const verify = async () => {
            if (hydrated) {
                await checkSession(); // Check and Refresh Token
                setIsChecking(false);
            }
        };
        verify();
    }, [hydrated, checkSession]);

    useEffect(() => {
        if (hydrated && !isChecking) {
            if (!isAuthenticated) {
                router.push('/login');
            }
        }
    }, [hydrated, isChecking, isAuthenticated, router]);

    if (!hydrated || isChecking) {
        return <AdminLoading />;
    }

    if (!isAuthenticated) {
        return null; // Will redirect via useEffect
    }

    if (user?.role?.toUpperCase() !== 'ADMIN') {
        notFound();
    }

    return (
        <div className="flex h-screen bg-black overflow-hidden relative">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-white/10 z-30 px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/Logo.png" alt="Takeoff Logo" width={100} height={30} className="h-6 w-auto object-contain" />
                    <span className="text-orange font-bold text-xs bg-orange/10 px-2 py-0.5 rounded border border-orange/20">ADMIN</span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>

            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <main className="flex-1 overflow-auto bg-black pt-20 md:pt-10 px-4 pb-10">
                {children}
            </main>
        </div>
    );
}
