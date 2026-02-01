"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast, { ToastMessage, ToastType } from '../components/ui/Toast';

interface ToastContextType {
    showToast: (message: string, type: ToastType, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType, duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastMessage = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);
    }, []);

    const success = (message: string, duration?: number) => showToast(message, 'success', duration);
    const error = (message: string, duration?: number) => showToast(message, 'error', duration);
    const info = (message: string, duration?: number) => showToast(message, 'info', duration);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end pointer-events-none">
                <div className="pointer-events-auto">
                    {toasts.map(toast => (
                        <Toast key={toast.id} toast={toast} onClose={removeToast} />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
