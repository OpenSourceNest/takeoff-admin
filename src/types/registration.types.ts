export interface Registration {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    isCommunityMember: boolean;
    communityDetails?: string | null;
    profession: string[];
    professionOther?: string | null;
    location: string;
    locationOther?: string | null;
    referralSource: string;
    referralSourceOther?: string | null;
    newsletterSub: boolean;
    pipelineInterest: string;
    interests?: string | null;
    openSourceKnowledge: number;
    eventId: string | null;
    status: string;
    checkedIn: boolean;
    checkInTime?: string | null;
    createdAt: string;
    event?: {
        name: string;
    };
}
