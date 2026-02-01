"use client";

import { useEffect, useState } from 'react';
import { AnalyticsService } from '@/services/analytics.service';
import { RegistrationStats, VelocityData, DemographicsData } from '@/types/analytics.types';
import RegistrationOverview from '@/components/dashboard/RegistrationOverview';
import VelocityChart from '@/components/dashboard/VelocityChart';
import ConversionFunnelChart from '@/components/dashboard/ConversionFunnelChart';
import DemographicsCharts from '@/components/dashboard/DemographicsCharts';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<RegistrationStats | null>(null);
    const [velocity, setVelocity] = useState<VelocityData[] | null>(null);
    const [demographics, setDemographics] = useState<DemographicsData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, velocityData, demogData] = await Promise.all([
                    AnalyticsService.getStats(),
                    AnalyticsService.getVelocity(),
                    AnalyticsService.getDemographics()
                ]);

                setStats(statsData);
                setVelocity(velocityData);
                setDemographics(demogData);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            }
        };

        fetchData();

        // Refresh every 10 seconds
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen">
            <div className="p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
                        <p className="text-white/60">Event registration metrics and insights (Real-time)</p>
                    </div>

                    {/* Overview Cards */}
                    <RegistrationOverview stats={stats} />

                    {/* Main Charts Area */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Velocity Chart - Takes up 2 columns */}
                        <div className="xl:col-span-2 min-w-0">
                            <VelocityChart data={velocity} />
                        </div>

                        {/* Conversion Funnel - Takes up 1 column */}
                        <div className="xl:col-span-1 min-w-0">
                            <ConversionFunnelChart stats={stats} />
                        </div>
                    </div>

                    {/* Demographics Row */}
                    <DemographicsCharts data={demographics} />
                </div>
            </div>
        </div>
    );
}
