import { apiClient } from '@/lib/apiClient';
import {
    RegistrationStats,
    VelocityData,
    DemographicsData,
    FilteredRegistrationData
} from '@/types/analytics.types';

export class AnalyticsService {
    /**
     * Get high-level registration statistics for dashboard
     */
    static async getStats(): Promise<RegistrationStats> {
        const res = await apiClient.get<{ data: RegistrationStats }>('/api/analytics/overview', {
            credentials: 'include'
        });
        return res.data;
    }

    /**
     * Get registration velocity (timeseries data)
     */
    static async getVelocity(days = 30): Promise<VelocityData[]> {
        const res = await apiClient.get<{ data: VelocityData[] }>(`/api/analytics/velocity?days=${days}`, {
            credentials: 'include'
        });
        return res.data;
    }

    /**
     * Get demographics breakdown (pie charts)
     */
    static async getDemographics(): Promise<DemographicsData> {
        const res = await apiClient.get<{ data: DemographicsData }>('/api/analytics/demographics', {
            credentials: 'include'
        });
        return res.data;
    }

    /**
     * Track a page visit (conversion funnel)
     */
    static async trackVisit(page: string, sessionId: string, referrer?: string): Promise<void> {
        try {
            await apiClient.post('/api/analytics/track-visit', {
                page,
                sessionId,
                referrer,
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'
            });
        } catch (error) {
            console.error('[AnalyticsService] tracking failed', error);
        }
    }

    /**
     * Get filtered registrations with breakdown stats
     */
    static async getFiltered(filters: {
        gender?: string;
        profession?: string[];
        checkedIn?: boolean;
        newsletterSub?: boolean;
    }): Promise<FilteredRegistrationData> {
        const params = new URLSearchParams();

        if (filters.gender && filters.gender !== 'all') {
            params.append('gender', filters.gender);
        }

        if (filters.profession && filters.profession.length > 0) {
            params.append('profession', filters.profession.join(','));
        }

        if (filters.checkedIn !== undefined) {
            params.append('checkedIn', String(filters.checkedIn));
        }

        if (filters.newsletterSub !== undefined) {
            params.append('newsletterSub', String(filters.newsletterSub));
        }

        const res = await apiClient.get<{ data: FilteredRegistrationData }>(`/api/analytics/filtered?${params.toString()}`, {
            credentials: 'include'
        });
        return res.data;
    }
}
