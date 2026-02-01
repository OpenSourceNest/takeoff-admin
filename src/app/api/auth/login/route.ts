import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Forward request to backend
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:4500';
        const response = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // Set HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set('token', data.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Changed from 'strict' to allow proxied requests
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        // Also set a non-httpOnly cookie for client-side role checking if needed, or just return user data
        // We'll rely on the returned user object for client state, but token is strictly in cookie

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
