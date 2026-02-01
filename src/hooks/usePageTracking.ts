import { useEffect } from 'react';
import { AnalyticsService } from '@/services/analytics.service';

const SESSION_ID_KEY = 'page-visit-session-id';

/**
 * Generate or retrieve session ID for tracking unique visitors
 */
const getSessionId = (): string => {
    if (typeof window === 'undefined') return '';

    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
};

/**
 * Track page visit for conversion rate calculation
 */
export const usePageTracking = (pageName: string) => {
    useEffect(() => {
        const trackVisit = async () => {
            const sessionId = getSessionId();
            const hasTracked = sessionStorage.getItem(`tracked_${pageName}`);

            // Only track once per page per browser session
            if (hasTracked) return;

            await AnalyticsService.trackVisit(
                pageName,
                sessionId,
                typeof document !== 'undefined' ? document.referrer : undefined
            );

            // Mark as tracked for this session
            sessionStorage.setItem(`tracked_${pageName}`, 'true');
        };

        trackVisit();
    }, [pageName]);
};
