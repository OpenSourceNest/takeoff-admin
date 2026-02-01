"use client";

import { RegistrationStats } from '@/types/analytics.types';

export default function RegistrationOverview({ stats }: { stats: RegistrationStats | null }) {
    if (!stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>
                ))}
            </div>
        );
    }

    const items = [
        {
            label: "Total Visits",
            value: stats.totalVisits,
            subtext: "Total page views",
            color: "text-white/70"
        },
        {
            label: "Unique Visitors",
            value: stats.uniqueVisits,
            subtext: "Distinct individuals",
            color: "text-white"
        },
        {
            label: "Total Registrations",
            value: stats.totalRegistrations,
            subtext: `${stats.recentRegistrations} in last 24h`,
            color: "text-white"
        },
        {
            label: "Capacity Expected",
            value: stats.targetCapacity,
            subtext: "Event Goal",
            color: "text-white/70"
        },
        {
            label: "Capacity Filled",
            value: `${Number(stats.percentageFilled).toFixed(3)}%`,
            subtext: `${stats.remainingSpots} spots remaining`,
            color: "text-orange"
        },
        {
            label: "Conversion Rate",
            value: `${Number(stats.conversionRate).toFixed(2)}%`,
            subtext: "Registrations / Visitors",
            color: stats.conversionRate > 50 ? "text-green-400" : stats.conversionRate > 25 ? "text-yellow-400" : "text-orange"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white/60 text-sm font-medium mb-2">{item.label}</h3>
                    <div className="text-3xl font-bold text-white mb-1" style={item.color && item.color.startsWith('text-') ? undefined : { color: item.color }}>
                        <span className={item.color}>{item.value}</span>
                    </div>
                    <div className="text-white/40 text-xs">{item.subtext}</div>
                </div>
            ))}
        </div>
    );
}
