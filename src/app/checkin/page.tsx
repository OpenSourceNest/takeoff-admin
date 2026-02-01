"use client";

import { useState } from 'react';

export default function CheckInPage() {
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [registrationId, setRegistrationId] = useState('');

    const handleCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Attempt to handle if user scanned a JSON QR code
            let finalId = registrationId.trim();
            if (finalId.startsWith('{') && finalId.endsWith('}')) {
                try {
                    const parsed = JSON.parse(finalId);
                    if (parsed.id) finalId = parsed.id;
                } catch {
                    console.warn("Failed to parse QR JSON, using raw value");
                }
            }

            const res = await fetch(`/api/events/registrations/${finalId}/checkin`, { method: 'POST' });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error("Checkin Failed:", res.status, errData);
                throw new Error('Check-in failed');
            }

            setStatus('success');
            setRegistrationId('');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Event Check-in</h1>

            <div className="max-w-md bg-white/5 border border-white/10 rounded-2xl p-6">
                <form onSubmit={handleCheckIn} className="space-y-4">
                    <div>
                        <label className="block text-white/70 mb-2">Registration ID</label>
                        <input
                            type="text"
                            value={registrationId}
                            onChange={(e) => setRegistrationId(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                            placeholder="Scan or enter ID"
                        />
                    </div>
                    <button type="submit" className="w-full bg-orange text-white py-2 rounded-lg hover:bg-orange/90">
                        Check In
                    </button>
                </form>

                {status === 'success' && (
                    <div className="mt-4 p-4 bg-green-500/10 text-green-400 rounded-lg text-center">
                        ✅ Checked in successfully!
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-4 p-4 bg-red-500/10 text-red-400 rounded-lg text-center">
                        ❌ Check-in failed or ID not found.
                    </div>
                )}
            </div>
        </div>
    );
}
