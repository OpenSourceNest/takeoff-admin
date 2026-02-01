"use client";

import { useState, useEffect } from 'react';
import { useToast } from "@/context/ToastContext";

export default function SettingsPage() {
    const [targetCapacity, setTargetCapacity] = useState<number>(500);
    const [eventId, setEventId] = useState<string>('');
    const [loadingConfig, setLoadingConfig] = useState(true);
    const [savingConfig, setSavingConfig] = useState(false);

    // Password Modal State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);

    // Fetch Event Config
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/events/config', {
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.success && data.data) {
                    setTargetCapacity(data.data.targetCapacity);
                    setEventId(data.data.id);
                }
            } catch (err) {
                console.error("Failed to fetch event config", err);
            } finally {
                setLoadingConfig(false);
            }
        };
        fetchConfig();
    }, []);

    const { success, error } = useToast();

    // ... (fetchConfig useEffect remains same)

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventId) return;
        setSavingConfig(true);
        try {
            const res = await fetch('/api/events/config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ eventId, targetCapacity })
            });
            const data = await res.json();
            if (data.success) {
                success("Event settings updated successfully!");
            } else {
                error("Failed to update settings. Below reisterd attendee.");
            }
        } catch (err) {
            console.error(err);
            error("Error saving settings.");
        } finally {
            setSavingConfig(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        setSavingPassword(true);

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ oldPassword, newPassword })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            setPasswordSuccess('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordSuccess('');
            }, 2000);
        } catch (err) {
            let message = 'Failed to change password';
            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'object' && err !== null && 'message' in err) {
                message = String((err as { message: unknown }).message);
            }
            setPasswordError(message);
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="p-8 relative">
            <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

            <div className="space-y-6 max-w-2xl">
                {/* Event Configuration Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Event Configuration</h2>
                    {loadingConfig ? (
                        <p className="text-white/40">Loading configuration...</p>
                    ) : (
                        <form onSubmit={handleSaveConfig} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Target Capacity</label>
                                <input
                                    type="number"
                                    value={targetCapacity}
                                    onChange={(e) => setTargetCapacity(Number(e.target.value))}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange"
                                />
                                <p className="text-xs text-white/40 mt-1">Update this to change the goal on your dashboard.</p>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={savingConfig || !eventId}
                                    className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {savingConfig ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Account Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Admin Account</h2>
                    <p className="text-white/60 text-sm mb-4">Manage your authentication credentials.</p>
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="text-orange hover:text-orange/80 text-sm font-medium cursor-pointer"
                    >
                        Change Password
                    </button>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowPasswordModal(false)}>
                    <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange"
                                    required
                                />
                            </div>

                            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                            {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="px-4 py-2 text-white/60 hover:text-white transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingPassword}
                                    className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange/90 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {savingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
