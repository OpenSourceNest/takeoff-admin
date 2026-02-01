"use client";

import { Icon } from '@iconify/react';
import CustomSelect from '@/components/ui/CustomSelect';

interface FilterPanelProps {
    filters: {
        gender: string;
        profession: string[];
        checkedIn: string;
        newsletterSub: string;
    };
    onFilterChange: (filters: { gender: string; profession: string[]; checkedIn: string; newsletterSub: string }) => void;
    filteredCount: number;
    totalCount: number;
}

const PROFESSIONS = [
    { value: 'STUDENT', label: 'Student' },
    { value: 'PROFESSIONAL_DEVELOPER', label: 'Professional Developer' },
    { value: 'HOBBYIST', label: 'Hobbyist' },
    { value: 'FRONTEND_DEVELOPER', label: 'Frontend Developer' },
    { value: 'BACKEND_DEVELOPER', label: 'Backend Developer' },
    { value: 'FULLSTACK_DEVELOPER', label: 'Fullstack Developer' },
    { value: 'UI_UX_DESIGNER', label: 'UI/UX Designer' },
    { value: 'DEVOPS_ENGINEER', label: 'DevOps Engineer' },
    { value: 'QA_ENGINEER', label: 'QA Engineer' },
    { value: 'SECURITY_ENGINEER', label: 'Security Engineer' },
    { value: 'DATA_SCIENTIST', label: 'Data Scientist' },
    { value: 'AI_ML_ENGINEER', label: 'AI/ML Engineer' },
    { value: 'PRODUCT_MANAGER', label: 'Product Manager' },
    { value: 'PROJECT_MANAGER', label: 'Project Manager' },
    { value: 'TECHNICAL_WRITER', label: 'Technical Writer' },
    { value: 'CONTENT_CREATOR', label: 'Content Creator' },
    { value: 'COMMUNITY_MANAGER', label: 'Community Manager' },
    { value: 'EDUCATOR', label: 'Educator' },
    { value: 'FOUNDER', label: 'Founder' },
    { value: 'IT_SUPPORT', label: 'IT Support' },
    { value: 'BUSINESS_ANALYST', label: 'Business Analyst' },
    { value: 'SMART_CONTRACT_DEVELOPER', label: 'Smart Contract Developer' },
    { value: 'BLOCKCHAIN_DEVELOPER', label: 'Blockchain Developer' },
    { value: 'WEB3_DEVELOPER', label: 'Web3 Developer' },
    { value: 'SOLIDITY_DEVELOPER', label: 'Solidity Developer' },
    { value: 'DAPP_DEVELOPER', label: 'DApp Developer' },
    { value: 'TOKENOMICS_SPECIALIST', label: 'Tokenomics Specialist' },
    { value: 'NFT_DEVELOPER', label: 'NFT Developer' },
    { value: 'DEFI_DEVELOPER', label: 'DeFi Developer' },
    { value: 'WEB3_SECURITY_AUDITOR', label: 'Web3 Security Auditor' },
    { value: 'BLOCKCHAIN_ARCHITECT', label: 'Blockchain Architect' },
    { value: 'OTHER', label: 'Other' }
];

const GENDER_OPTIONS = [
    { value: 'all', label: 'All Genders' },
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' }
];

const CHECKIN_OPTIONS = [
    { value: 'all', label: 'All Status' },
    { value: 'true', label: 'Checked In' },
    { value: 'false', label: 'Not Checked In' }
];

const NEWSLETTER_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'true', label: 'Subscribed' },
    { value: 'false', label: 'Not Subscribed' }
];

export default function FilterPanel({ filters, onFilterChange, filteredCount, totalCount }: FilterPanelProps) {
    const handleGenderChange = (value: string | string[]) => {
        onFilterChange({ ...filters, gender: value as string });
    };

    const handleProfessionChange = (value: string | string[]) => {
        onFilterChange({ ...filters, profession: value as string[] });
    };

    const handleCheckedInChange = (value: string | string[]) => {
        onFilterChange({ ...filters, checkedIn: value as string });
    };

    const handleNewsletterChange = (value: string | string[]) => {
        onFilterChange({ ...filters, newsletterSub: value as string });
    };

    const clearFilters = () => {
        onFilterChange({
            gender: 'all',
            profession: [],
            checkedIn: 'all',
            newsletterSub: 'all'
        });
    };

    const hasActiveFilters = filters.gender !== 'all' ||
        filters.profession.length > 0 ||
        filters.checkedIn !== 'all' ||
        filters.newsletterSub !== 'all';

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">Filters</h3>
                    <p className="text-white/60 text-sm">
                        Showing {filteredCount} of {totalCount} registrations
                    </p>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-orange hover:text-white transition-colors text-sm flex items-center gap-1"
                    >
                        <Icon icon="tabler:x" className="w-4 h-4" />
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Gender Filter */}
                <div>
                    <label className="text-white/70 text-sm mb-3 block">Gender</label>
                    <CustomSelect
                        options={GENDER_OPTIONS}
                        value={filters.gender}
                        onChange={handleGenderChange}
                        placeholder="Select gender"
                    />
                </div>

                {/* Check-in Status Filter */}
                <div>
                    <label className="text-white/70 text-sm mb-3 block">Check-in Status</label>
                    <CustomSelect
                        options={CHECKIN_OPTIONS}
                        value={filters.checkedIn}
                        onChange={handleCheckedInChange}
                        placeholder="Select status"
                    />
                </div>

                {/* Newsletter Subscription Filter */}
                <div>
                    <label className="text-white/70 text-sm mb-3 block">Newsletter</label>
                    <CustomSelect
                        options={NEWSLETTER_OPTIONS}
                        value={filters.newsletterSub}
                        onChange={handleNewsletterChange}
                        placeholder="Select newsletter status"
                    />
                </div>

                {/* Profession Multi-Select */}
                <div>
                    <label className="text-white/70 text-sm mb-3 block">Profession</label>
                    <CustomSelect
                        options={PROFESSIONS}
                        value={filters.profession}
                        onChange={handleProfessionChange}
                        placeholder="Select professions"
                        multiple
                    />
                </div>
            </div>
        </div>
    );
}
