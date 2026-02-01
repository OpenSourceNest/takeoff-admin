"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { Icon } from '@iconify/react';

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: <Icon icon="heroicons:squares-2x2" /> },
        { name: 'Registrations', href: '/registrations', icon: <Icon icon="heroicons:users" /> },
        { name: 'Settings', href: '/settings', icon: <Icon icon="heroicons:cog-6-tooth" /> },
    ];

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-white/10 text-white min-h-screen flex flex-col
                transform transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:inset-auto
                ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-1 hover:opacity-80 transition-opacity">
                            <Image src="/Logo.png" alt="Takeoff Logo" width={100} height={30} className="h-6 w-auto object-contain" />
                            <span className="text-orange font-bold text-sm bg-orange/10 px-2 py-0.5 rounded border border-orange/20">ADMIN</span>
                        </Link>
                        <p className="text-xs text-white/40 mt-1 truncate max-w-[180px]">{user?.email}</p>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="md:hidden text-white/50 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose} // Close on nav click (mobile)
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-orange/10 text-orange border-l-2 border-orange'
                                    : 'text-white/70 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-white/10 bg-[#111]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                        <span className="text-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" x2="9" y1="12" y2="12" />
                            </svg>
                        </span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
