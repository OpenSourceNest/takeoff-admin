"use client";

import { RegistrationStats } from '@/types/analytics.types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ConversionFunnelChart({ stats }: { stats: RegistrationStats | null }) {
    if (!stats) return <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />;

    const data = [
        {
            name: 'Total Visits',
            value: stats.totalVisits,
            color: '#ffffff80'
        },
        {
            name: 'Unique Visitors',
            value: stats.uniqueVisits,
            color: '#A9500C'
        },
        {
            name: 'Registrations',
            value: stats.totalRegistrations,
            color: '#22c55e'
        }
    ];

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
            <h3 className="text-lg font-bold text-white mb-2">Conversion Funnel</h3>
            <p className="text-white/40 text-sm mb-6">Traffic to Registration drop-off</p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                        <XAxis type="number" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#ffffff"
                            fontSize={14}
                            tick={{ fill: '#fff', fontWeight: 500 }}
                            tickLine={false}
                            axisLine={false}
                            width={120}
                        />
                        <Tooltip
                            cursor={{ fill: '#ffffff10' }}
                            contentStyle={{
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #ffffff20',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: '#ffffff80', marginBottom: '4px' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
