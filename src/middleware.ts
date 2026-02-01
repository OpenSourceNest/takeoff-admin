import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isPublicPath = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup') ||
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname === '/';

    if (!isPublicPath) {
        const token = request.cookies.get('token');

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const payloadPart = token.value.split('.')[1];
            if (payloadPart) {
                const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
                const decoded = JSON.parse(atob(base64));

                const role = (decoded.role || '').toUpperCase();
                if (role !== 'ADMIN') {
                    // Force logout and login if not admin
                    return NextResponse.redirect(new URL('/login', request.url));
                }
            }
        } catch {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
