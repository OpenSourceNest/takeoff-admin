/**
 * Base API Service for handling requests with consistent error handling
 */

export class ApiService {
    protected static async fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || errorData.error || `Request failed with status ${response.status}`;

            // In a real production app, you might log this to Sentry/Datadog
            console.error(`[ApiService] Error ${response.status}: ${errorMessage}`, {
                url,
                status: response.status,
                statusText: response.statusText,
                errorData
            });

            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data.data;
    }
}
