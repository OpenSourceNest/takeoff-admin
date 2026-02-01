import { apiClient } from '@/lib/apiClient';
import { Registration } from '@/types/registration.types';

export class EventService {
    /**
     * Get all registrations (with optional token-based authorization handled by middleware/proxy)
     */
    static async getRegistrations(token: string): Promise<Registration[]> {
        const res = await apiClient.get<{ data: Registration[] }>('/api/events/registrations', {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
        });
        return res.data;
    }

    /**
     * Search registrations by query
     */
    static async searchRegistrations(token: string, search: string): Promise<Registration[]> {
        const res = await apiClient.get<{ data: Registration[] }>(`/api/events/search?search=${encodeURIComponent(search)}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
        });
        return res.data;
    }

    /**
     * Get QR code for a specific registration
     */
    static async getRegistrationQR(id: string): Promise<string> {
        const res = await apiClient.get<{ qrCode: string }>(`/api/events/registrations/${id}/qr`, {
            credentials: 'include'
        });
        return res.qrCode;
    }

    /**
     * Record check-in for a specific attendee
     */
    static async checkIn(id: string): Promise<void> {
        await apiClient.post(`/api/events/registrations/${id}/checkin`, {}, {
            credentials: 'include'
        });
    }
}
