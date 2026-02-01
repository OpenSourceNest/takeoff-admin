export class ApiError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
    }
}

interface RequestOptions extends RequestInit {
    data?: unknown;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { data, headers, ...customConfig } = options;

    const config: RequestInit = {
        method: options.method || "GET",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        ...customConfig,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    let response: Response;
    try {
        response = await fetch(endpoint, config);
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        throw new ApiError("Network error: Unable to connect to the server.", 0);
    }

    let result;
    try {
        const text = await response.text();
        result = text ? JSON.parse(text) : {};
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        if (!response.ok) {
            throw new ApiError(`Server Error: ${response.statusText}`, response.status);
        }
        return {} as T;
    }

    if (!response.ok) {
        throw new ApiError(result.message || "Something went wrong", response.status);
    }

    return result as T;
}

export const apiClient = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, data: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, data, method: "POST" }),

    put: <T>(endpoint: string, data: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, data, method: "PUT" }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: "DELETE" }),
};
