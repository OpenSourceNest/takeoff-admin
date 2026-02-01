"use client";

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastProps {
    toast: ToastMessage;
    onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true));

        const timer = setTimeout(() => {
            setIsVisible(false);
            // Wait for exit animation to finish before removing
            setTimeout(() => onClose(toast.id), 300);
        }, toast.duration || 3000);

        return () => clearTimeout(timer);
    }, [toast, onClose]);

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    const icons = {
        success: 'tabler:check',
        error: 'tabler:alert-triangle',
        info: 'tabler:info-circle'
    };

    return (
        <div
            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white font-medium
                transform transition-all duration-300 ease-out mb-2
                ${bgColors[toast.type]}
                ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <Icon icon={icons[toast.type]} className="w-6 h-6" />
            <span>{toast.message}</span>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onClose(toast.id), 300);
                }}
                className="ml-4 opacity-70 hover:opacity-100 transition-opacity"
            >
                ✕
            </button>
        </div>
    );
}
