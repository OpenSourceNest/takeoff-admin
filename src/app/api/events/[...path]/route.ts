import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxy(request, path);
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxy(request, path);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxy(request, path);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxy(request, path);
}

async function handleProxy(request: Request, path: string[]) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:4500';

        const url = new URL(request.url);
        const searchParams = url.searchParams.toString();
        const fullPath = path.join('/');
        const targetUrl = `${backendUrl}/api/events/${fullPath}${searchParams ? `?${searchParams}` : ''}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token.value}`;
        }

        const options: RequestInit = {
            method: request.method,
            headers,
        };

        if (request.method !== 'GET' && request.method !== 'HEAD') {
            options.body = await request.text();
        }

        const response = await fetch(targetUrl, options);
        const data = await response.json().catch(() => ({}));

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[Events Proxy Error]:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
