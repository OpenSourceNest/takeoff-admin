import { ApiService } from './api.service';
import {
    RegistrationStats,
    VelocityData,
    DemographicsData,
    FilteredRegistrationData
} from '@/types/analytics.types';

export class AnalyticsService extends ApiService {
    /**
     * Get high-level registration statistics for dashboard
     */
    static async getStats(): Promise<RegistrationStats> {
        return this.fetchJson<RegistrationStats>('/api/analytics/overview', {
            credentials: 'include'
        });
    }

    /**
     * Get registration velocity (timeseries data)
     */
    static async getVelocity(days = 30): Promise<VelocityData[]> {
        return this.fetchJson<VelocityData[]>(`/api/analytics/velocity?days=${days}`, {
            credentials: 'include'
        });
    }

    /**
     * Get demographics breakdown (pie charts)
     */
    static async getDemographics(): Promise<DemographicsData> {
        return this.fetchJson<DemographicsData>('/api/analytics/demographics', {
            credentials: 'include'
        });
    }

    /**
     * Track a page visit (conversion funnel)
     */
    static async trackVisit(page: string, sessionId: string, referrer?: string): Promise<void> {
        try {
            await fetch('/api/analytics/track-visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page,
                    sessionId,
                    referrer,
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'
                })
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

        return this.fetchJson<FilteredRegistrationData>(`/api/analytics/filtered?${params.toString()}`, {
            credentials: 'include'
        });
    }
}
