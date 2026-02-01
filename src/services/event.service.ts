import { ApiService } from './api.service';
import { Registration } from '@/types/registration.types';

export class EventService extends ApiService {
    /**
     * Get all registrations (with optional token-based authorization handled by middleware/proxy)
     */
    static async getRegistrations(token: string): Promise<Registration[]> {
        return this.fetchJson<Registration[]>('/api/events/registrations', {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
        });
    }

    /**
     * Search registrations by query
     */
    static async searchRegistrations(token: string, search: string): Promise<Registration[]> {
        return this.fetchJson<Registration[]>(`/api/events/search?search=${encodeURIComponent(search)}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
        });
    }

    /**
     * Get QR code for a specific registration
     */
    static async getRegistrationQR(id: string): Promise<string> {
        const data = await this.fetchJson<{ qrCode: string }>(`/api/events/registrations/${id}/qr`, {
            credentials: 'include'
        });
        return data.qrCode;
    }

    /**
     * Record check-in for a specific attendee
     */
    static async checkIn(id: string): Promise<void> {
        await this.fetchJson(`/api/events/registrations/${id}/checkin`, {
            method: 'POST',
            credentials: 'include'
        });
    }
}
