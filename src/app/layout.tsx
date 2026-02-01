import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { ToastProvider } from "@/context/ToastContext";

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    display: "swap",
});

export const metadata: Metadata = {
    title: "TAKEOFF Analytics Portal",
    description: "Real-time analytics and management for TAKEOFF 2026",
};

export default function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${montserrat.variable} font-sans antialiased`}>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </body>
        </html>
    );
}
