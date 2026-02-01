import { Registration } from './registration.types';

export interface RegistrationStats {
    totalRegistrations: number;
    targetCapacity: number;
    percentageFilled: number;
    recentRegistrations: number;
    remainingSpots: number;
    conversionRate: number;
    totalVisits: number;
    uniqueVisits: number;
}

export interface VelocityData {
    date: string;
    count: number;
}

export interface DemographicsData {
    professions: { name: string; value: number }[];
    genders: { name: string; value: number }[];
    locations: { name: string; value: number }[];
    referrals: { name: string; value: number }[];
    statuses: { name: string; value: number }[];
    checkins: { name: string; value: number }[];
    openSource: {
        average: string;
        distribution: { name: string; value: number }[];
    };
}

export interface FilteredRegistrationData {
    totalCount: number;
    registrations: Registration[];
    breakdowns: {
        gender: { name: string; count: number }[];
        checkedIn: { name: string; count: number }[];
        newsletterSub: { name: string; count: number }[];
        profession: { name: string; count: number }[];
    };
}
