"use client";

import { Icon } from '@iconify/react';

interface CheckInAnalyticsProps {
    checkedInCount: number;
    notCheckedInCount: number;
    totalCount: number;
}

export default function CheckInAnalytics({ checkedInCount, notCheckedInCount, totalCount }: CheckInAnalyticsProps) {
    const checkInRate = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Icon icon="tabler:check" className="w-6 h-6 text-green-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Check-in Analytics</h3>
                    <p className="text-white/60 text-sm">Real-time attendance tracking</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="text-green-400 text-2xl font-bold mb-1">{checkedInCount}</div>
                    <div className="text-white/70 text-xs">Checked In</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-white text-2xl font-bold mb-1">{notCheckedInCount}</div>
                    <div className="text-white/70 text-xs">Not Checked In</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70 text-sm">Check-in Rate</span>
                    <span className="text-green-400 font-bold text-lg">{checkInRate}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                        style={{ width: `${checkInRate}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
