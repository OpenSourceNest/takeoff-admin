"use client";

import { VelocityData } from '@/types/analytics.types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function VelocityChart({ data }: { data: VelocityData[] | null }) {
    if (!data) return <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Registration Velocity</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#ffffff50"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return `${date.getDate()}/${date.getMonth() + 1}`;
                            }}
                        />
                        <YAxis
                            stroke="#ffffff50"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #ffffff20',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#A9500C"
                            strokeWidth={3}
                            dot={{ fill: '#A9500C', r: 4, strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
