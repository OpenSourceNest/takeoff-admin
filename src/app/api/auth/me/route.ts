import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const backendUrl = process.env.BACKEND_URL || 'http://localhost:4500';

        const response = await fetch(`${backendUrl}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // If backend returns a new token (Refresh Logic), update the cookie
        if (data.data?.token) {
            cookieStore.set('token', data.data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: '/',
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                user: data.data // data.data is the user object from backend
            }
        });
    } catch {
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
