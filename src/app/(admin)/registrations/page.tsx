"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from "@/context/ToastContext";
import { Icon } from '@iconify/react';
import NextImage from 'next/image';
import FilterPanel from '@/components/dashboard/FilterPanel';
import { AnalyticsService } from '@/services/analytics.service';
import { EventService } from '@/services/event.service';
import { Registration } from '@/types/registration.types';

export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQr, setSelectedQr] = useState<string | null>(null);
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
    const { token, hydrated } = useAuthStore();

    // Filter State
    const [filters, setFilters] = useState({
        gender: 'all',
        profession: [] as string[],
        checkedIn: 'all',
        newsletterSub: 'all'
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(registrations.length / itemsPerPage);
    const currentRegistrations = registrations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const { success, error: errorToast } = useToast();

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        success("ID copied to clipboard!");
    };

    // Fetch all registrations (for total count)
    useEffect(() => {
        if (!hydrated || !token) return;

        const fetchAllRegistrations = async () => {
            try {
                const data = await EventService.getRegistrations(token);
                setAllRegistrations(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchAllRegistrations();
    }, [token, hydrated]);

    // Fetch filtered registrations based on searchQuery and filters
    useEffect(() => {
        if (!hydrated || !token) return;

        const fetchRegistrations = async () => {
            try {
                if (searchQuery.trim()) {
                    const data = await EventService.searchRegistrations(token, searchQuery);
                    setRegistrations(data);
                } else {
                    const hasActiveFilters = filters.gender !== 'all' ||
                        filters.profession.length > 0 ||
                        filters.checkedIn !== 'all' ||
                        filters.newsletterSub !== 'all';

                    if (hasActiveFilters) {
                        const data = await AnalyticsService.getFiltered({
                            gender: filters.gender !== 'all' ? filters.gender : undefined,
                            profession: filters.profession.length > 0 ? filters.profession : undefined,
                            checkedIn: filters.checkedIn !== 'all' ? filters.checkedIn === 'true' : undefined,
                            newsletterSub: filters.newsletterSub !== 'all' ? filters.newsletterSub === 'true' : undefined,
                        });
                        setRegistrations(data.registrations);
                    } else {
                        const data = await EventService.getRegistrations(token);
                        setRegistrations(data);
                    }
                }
                setError('');
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch registrations';
                if (message.includes('401') || message.includes('403')) {
                    setError("SESSION_EXPIRED");
                } else {
                    setError(message);
                }
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        const debounce = setTimeout(() => {
            fetchRegistrations();
        }, 500);

        return () => clearTimeout(debounce);
    }, [token, hydrated, searchQuery, filters]);

    const handleViewQR = async (id: string) => {
        try {
            const qrCode = await EventService.getRegistrationQR(id);
            setSelectedQr(qrCode);
        } catch (err) {
            console.error(err);
            errorToast('Error fetching QR Code');
        }
    };

    const handleCheckIn = async (id: string) => {
        try {
            await EventService.checkIn(id);

            // Update local state
            setRegistrations(prev => prev.map(reg =>
                reg.id === id ? { ...reg, checkedIn: true, checkInTime: new Date().toISOString() } : reg
            ));

            // Also update selected registration if open
            if (selectedRegistration && selectedRegistration.id === id) {
                setSelectedRegistration(prev => prev ? { ...prev, checkedIn: true } : null);
            }

            success('Attendee checked in successfully!');
        } catch (error) {
            console.error(error);
            errorToast('Error performing check-in');
        }
    };

    if (error === "SESSION_EXPIRED") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md w-full backdrop-blur-sm">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon icon="heroicons:lock-closed" className="text-2xl text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Session Expired</h3>
                    <p className="text-white/60 mb-6">Your session has expired. Please log in again to view registrations.</p>
                    <a
                        href="/login"
                        className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors w-full"
                    >
                        Log In
                    </a>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3">
                    <Icon icon="heroicons:exclamation-triangle" className="text-xl" />
                    <span>Error: {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 relative">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-white">Registrations</h1>
                <div className="relative w-full md:w-auto">
                    <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search attendees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-orange w-full md:w-80 transition-all"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <FilterPanel
                    filters={filters}
                    onFilterChange={setFilters}
                    filteredCount={registrations.length}
                    totalCount={allRegistrations.length}
                />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="p-8 text-white/40 text-center">Loading registrations...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-white/5 text-white/60 uppercase text-xs">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Gender</th>
                                        <th className="p-4">Location</th>
                                        <th className="p-4">Profession</th>
                                        <th className="p-4">Open Source</th>
                                        <th className="p-4">Referral</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Check-in</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white text-sm">
                                    {currentRegistrations.map((reg) => (
                                        <tr key={reg.id} className="border-t border-white/5 hover:bg-white/5 transition">
                                            <td
                                                className="p-4 text-white/40 font-mono text-xs cursor-pointer hover:text-orange transition-colors"
                                                onClick={() => handleCopyId(reg.id)}
                                                title="Click to copy ID"
                                            >
                                                {reg.id.slice(0, 8)}...
                                            </td>
                                            <td className="p-4 font-medium sticky left-0 bg-[#0a0a0a] z-10 border-r border-white/10">
                                                {reg.firstName} {reg.lastName}
                                            </td>
                                            <td className="p-4 text-white/70">{reg.email}</td>
                                            <td className="p-4">{reg.gender}</td>
                                            <td className="p-4">{reg.location}</td>
                                            <td className="p-4 max-w-[200px] truncate" title={reg.profession.join(", ")}>
                                                {reg.profession.slice(0, 2).join(", ")}{reg.profession.length > 2 && "..."}
                                            </td>
                                            <td className="p-4 text-center">{reg.openSourceKnowledge}/10</td>
                                            <td className="p-4 max-w-[150px] truncate">{reg.referralSource}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs ${reg.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {reg.status || 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {reg.checkedIn ? (
                                                    <span className="text-green-400 flex items-center gap-1">
                                                        <Icon icon="heroicons:check-circle" className="text-sm" /> <span className="text-xs">Yes</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-white/40">No</span>
                                                )}
                                                {!reg.checkedIn && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCheckIn(reg.id);
                                                        }}
                                                        className="ml-2 bg-green-600/20 text-green-400 hover:bg-green-600/40 px-2 py-0.5 rounded text-xs transition-colors cursor-pointer border border-green-600/30"
                                                    >
                                                        Check In
                                                    </button>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => setSelectedRegistration(reg)}
                                                    className="text-white/70 hover:text-white text-xs underline mr-3 cursor-pointer"
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    onClick={() => handleViewQR(reg.id)}
                                                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs cursor-pointer transition-colors"
                                                >
                                                    QR
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {registrations.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-12 text-center text-white/40">
                                {searchQuery ? (
                                    <>
                                        <Icon icon="heroicons:magnifying-glass" className="text-4xl text-white/20 mb-3" />
                                        <p>No registrations found matching &quot;{searchQuery}&quot;</p>
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="heroicons:inbox" className="w-16 h-16 text-white/20 mb-4" />
                                        <p className="text-xl font-medium text-white/60">No Registrations Yet</p>
                                        <p className="text-white/40 mt-2 max-w-sm">
                                            Your event roster is currently empty. Once attendees sign up, they will appear here.
                                        </p>
                                    </>
                                )}
                            </div>
                        )}

                        {registrations.length > itemsPerPage && (
                            <div className="flex justify-between items-center p-4 border-t border-white/10 bg-white/5">
                                <div className="text-white/40 text-sm">
                                    Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white">{Math.min(currentPage * itemsPerPage, registrations.length)}</span> of <span className="text-white">{registrations.length}</span> entries
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 bg-white/10 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 bg-white/10 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* QR Modal */}
            {selectedQr && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedQr(null)}>
                    <div className="bg-white p-6 rounded-2xl text-center" onClick={e => e.stopPropagation()}>
                        <h3 className="text-black font-bold mb-4">Attendee QR Code</h3>
                        <div className="relative w-64 h-64 mx-auto mb-4">
                            <NextImage
                                src={selectedQr}
                                alt="QR Code"
                                fill
                                className="object-contain"
                                unoptimized // QR codes are data URIs
                            />
                        </div>
                        <button
                            onClick={() => setSelectedQr(null)}
                            className="text-gray-500 underline text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {
                selectedRegistration && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRegistration(null)}>
                        <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedRegistration.firstName} {selectedRegistration.lastName}</h3>
                                    <p className="text-orange mb-1">{selectedRegistration.email}</p>
                                    <div
                                        className="text-white/40 font-mono text-xs cursor-pointer hover:text-white flex items-center gap-2"
                                        onClick={() => handleCopyId(selectedRegistration.id)}
                                        title="Click to copy ID"
                                    >
                                        ID: {selectedRegistration.id} <Icon icon="heroicons:clipboard" className="text-sm" />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedRegistration(null)}
                                    className="text-white/40 hover:text-white transition-colors"
                                >
                                    <Icon icon="heroicons:x-mark" className="text-xl" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-white/40 text-xs uppercase tracking-wider mb-1">Status</label>
                                        <div className="text-white flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-xs ${selectedRegistration.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>{selectedRegistration.status}</span>
                                            {selectedRegistration.checkedIn && <span className="text-green-400 text-xs flex items-center gap-1"><Icon icon="heroicons:check-circle" /> Checked In</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-white/40 text-xs uppercase tracking-wider mb-1">Gender</label>
                                        <div className="text-white">{selectedRegistration.gender}</div>
                                    </div>
                                    <div>
                                        <label className="block text-white/40 text-xs uppercase tracking-wider mb-1">Location</label>
                                        <div className="text-white">{selectedRegistration.location} {selectedRegistration.locationOther && `(${selectedRegistration.locationOther})`}</div>
                                    </div>
                                    <div>
                                        <label className="block text-white/40 text-xs uppercase tracking-wider mb-1">Profession</label>
                                        <div className="text-white flex flex-wrap gap-1">
                                            {selectedRegistration.profession.map(p => (
                                                <span key={p} className="bg-white/10 px-2 py-0.5 rounded text-xs">{p}</span>
                                            ))}
                                            {selectedRegistration.professionOther && <span className="bg-white/10 px-2 py-0.5 rounded text-xs italic">{selectedRegistration.professionOther}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-white/40 text-xs uppercase tracking-wider mb-1">Open Source Knowledge</label>
                                        <div className="text-white flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange" style={{ width: `${selectedRegistration.openSourceKnowledge * 10}%` }}></div>
                                            </div>
                                            <span className="font-mono">{selectedRegistration.openSourceKnowledge}/10</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-white/40 text-xs uppercase tracking-wider mb-1">Community Member</label>
                                        <div className="text-white">{selectedRegistration.isCommunityMember ? 'Yes' : 'No'}</div>
                                        {selectedRegistration.communityDetails && <div className="text-white/60 text-xs mt-1">{selectedRegistration.communityDetails}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-white/40 text-xs uppercase tracking-wider mb-1">Pipeline Interest</label>
                                        <div className="text-white">{selectedRegistration.pipelineInterest}</div>
                                    </div>
                                    <div>
                                        <label className="block text-white/40 text-xs uppercase tracking-wider mb-1">Newsletter</label>
                                        <div className="text-white flex items-center gap-1">
                                            {selectedRegistration.newsletterSub ? (
                                                <>Subscribed <Icon icon="heroicons:check-circle" className="text-green-400" /></>
                                            ) : (
                                                'Not Subscribed'
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {(selectedRegistration.interests || selectedRegistration.referralSource) && (
                                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                                    <div>
                                        <label className="block text-white/40 text-xs uppercase tracking-wider mb-1">Referral Source</label>
                                        <div className="text-white">{selectedRegistration.referralSource} {selectedRegistration.referralSourceOther && `(${selectedRegistration.referralSourceOther})`}</div>
                                    </div>
                                    {selectedRegistration.interests && (
                                        <div>
                                            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1">Interests</label>
                                            <div className="text-white/80 bg-white/5 p-3 rounded-lg text-sm">{selectedRegistration.interests}</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-8 flex justify-between items-center">
                                {!selectedRegistration.checkedIn ? (
                                    <button
                                        onClick={() => {
                                            handleCheckIn(selectedRegistration.id);
                                            // Close modal after checkin if desired, or keep open to see status change
                                            // setSelectedRegistration(null); 
                                        }}
                                        className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20 flex items-center gap-2"
                                    >
                                        <Icon icon="heroicons:check" className="text-lg" /> Check In Attendee
                                    </button>
                                ) : (
                                    <div className="px-6 py-2 bg-green-900/30 text-green-400 font-bold rounded-lg border border-green-500/30">
                                        Already Checked In
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedRegistration(null)}
                                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
}
