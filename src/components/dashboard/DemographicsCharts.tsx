"use client";

import { DemographicsData } from '@/types/analytics.types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#A9500C', '#D97706', '#EA580C', '#92400E', '#78350F', '#F97316', '#C2410C', '#7C2D12'];

export default function DemographicsCharts({ data }: { data: DemographicsData | null }) {
    if (!data) return <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {/* 1. Professions (Horizontal Bar) - Solves overflow issue */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 xl:col-span-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-6">Top Professions</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={data.professions} layout="vertical" margin={{ left: 10 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={100}
                                stroke="#ffffff70"
                                fontSize={10}
                                tickFormatter={(val) => val.length > 15 ? val.slice(0, 15) + '...' : val}
                            />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                            <Bar dataKey="value" fill="#EA580C" radius={[0, 4, 4, 0]} barSize={15} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Gender (Pie) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-w-0">
                <h3 className="text-lg font-bold text-white mb-6">Gender Distribution</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <PieChart>
                            <Pie
                                data={data.genders}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.genders.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Check-in Status (Pie) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-w-0">
                <h3 className="text-lg font-bold text-white mb-6">Check-in Status</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <PieChart>
                            <Pie
                                data={data.checkins}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={80}
                                dataKey="value"
                            >
                                <Cell key="checked" fill="#22c55e" /> {/* Green */}
                                <Cell key="unchecked" fill="#3f3f46" /> {/* Gray */}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. Open Source Knowledge (Bar) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 xl:col-span-2 min-w-0">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Open Source Knowledge</h3>
                    <div className="text-orange font-mono text-sm">Avg Score: {data.openSource.average}/10</div>
                </div>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={data.openSource.distribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff' }} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#fff' }} />
                            <Bar dataKey="value" fill="#D97706" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 5. Locations (List) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Top Locations</h3>
                <div className="space-y-4">
                    {data.locations.map((loc, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <span className="text-white/70 text-sm truncate max-w-[150px]" title={loc.name}>{loc.name}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange"
                                        style={{ width: `${(loc.value / Math.max(...data.locations.map(l => l.value))) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-white font-mono text-xs w-6 text-right">{loc.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
