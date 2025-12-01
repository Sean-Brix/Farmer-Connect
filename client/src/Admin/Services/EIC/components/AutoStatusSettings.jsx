import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function AutoStatusSettings() {
    const { isDark } = useTheme();
    const [cronEnabled, setCronEnabled] = useState(false);
    const [autoArchiveEnabled, setAutoArchiveEnabled] = useState(false);
    const [autoArchiveDays, setAutoArchiveDays] = useState(30);
    const [autoRejectEnabled, setAutoRejectEnabled] = useState(false);
    const [autoRejectGraceDays, setAutoRejectGraceDays] = useState(0);
    const [autoNoPickupEnabled, setAutoNoPickupEnabled] = useState(false);
    const [autoNoPickupDays, setAutoNoPickupDays] = useState(3);
    const [loading, setLoading] = useState(true);
    const [triggering, setTriggering] = useState(false);
    const [savingArchive, setSavingArchive] = useState(false);
    const [savingReject, setSavingReject] = useState(false);
    const [savingNoPickup, setSavingNoPickup] = useState(false);

    // Fetch current cron status on component mount
    useEffect(() => {
        fetchCronStatus();
    }, []);

    const fetchCronStatus = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/cron/status');
            setCronEnabled(response.data.enabled);
            setAutoArchiveEnabled(response.data.autoArchive?.enabled || false);
            setAutoArchiveDays(response.data.autoArchive?.days || 30);
            setAutoRejectEnabled(response.data.autoReject?.enabled || false);
            setAutoRejectGraceDays(response.data.autoReject?.graceDays || 0);
            setAutoNoPickupEnabled(response.data.autoNoPickup?.enabled || false);
            setAutoNoPickupDays(response.data.autoNoPickup?.days || 3);
        } catch (error) {
            console.error('Error fetching cron status:', error);
            toast.error('Failed to load automation status');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleCron = async () => {
        try {
            const response = await axios.post('/api/cron/toggle', {
                enabled: !cronEnabled
            });

            if (response.data.success) {
                setCronEnabled(response.data.enabled);
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error('Error toggling cron job:', error);
            toast.error(error.response?.data?.message || 'Failed to toggle automation');
        }
    };

    const handleManualTrigger = async () => {
        try {
            setTriggering(true);
            const response = await axios.post('/api/cron/trigger');

            if (response.data.success) {
                const { updated = 0, rejected = 0, noPickup = 0, archived = 0 } = response.data;
                if (updated === 0 && rejected === 0 && noPickup === 0 && archived === 0) {
                    toast.success('No overdue items found');
                } else {
                    const messages = [];
                    if (updated > 0) messages.push(`${updated} marked as late return`);
                    if (rejected > 0) messages.push(`${rejected} auto-rejected`);
                    if (noPickup > 0) messages.push(`${noPickup} marked as no pickup`);
                    if (archived > 0) messages.push(`${archived} auto-archived`);
                    toast.success(messages.join(', '));
                }
            } else {
                toast.error(response.data.message || 'Failed to run manual check');
            }
        } catch (error) {
            console.error('Error triggering manual check:', error);
            toast.error(error.response?.data?.message || 'Failed to run manual check');
        } finally {
            setTriggering(false);
        }
    };

    const handleAutoArchiveToggle = async () => {
        try {
            setSavingArchive(true);
            const response = await axios.post('/api/cron/auto-archive', {
                enabled: !autoArchiveEnabled,
                days: autoArchiveDays
            });

            if (response.data.success) {
                setAutoArchiveEnabled(response.data.settings.enabled);
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error('Error toggling auto-archive:', error);
            toast.error(error.response?.data?.message || 'Failed to toggle auto-archive');
        } finally {
            setSavingArchive(false);
        }
    };

    const handleArchiveDaysChange = async (newDays) => {
        const days = parseInt(newDays, 10);
        if (isNaN(days) || days < 1 || days > 365) {
            toast.error('Days must be between 1 and 365');
            return;
        }

        try {
            setSavingArchive(true);
            const response = await axios.post('/api/cron/auto-archive', {
                enabled: autoArchiveEnabled,
                days
            });

            if (response.data.success) {
                setAutoArchiveDays(days);
                toast.success('Auto-archive threshold updated');
            }
        } catch (error) {
            console.error('Error updating archive days:', error);
            toast.error(error.response?.data?.message || 'Failed to update threshold');
        } finally {
            setSavingArchive(false);
        }
    };

    const handleAutoRejectToggle = async () => {
        try {
            setSavingReject(true);
            const response = await axios.post('/api/cron/auto-reject', {
                enabled: !autoRejectEnabled,
                graceDays: autoRejectGraceDays
            });

            if (response.data.success) {
                setAutoRejectEnabled(response.data.settings.enabled);
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error('Error toggling auto-reject:', error);
            toast.error(error.response?.data?.message || 'Failed to toggle auto-reject');
        } finally {
            setSavingReject(false);
        }
    };

    const handleRejectGraceDaysChange = async (newDays) => {
        const graceDays = parseInt(newDays, 10);
        if (isNaN(graceDays) || graceDays < 0 || graceDays > 30) {
            toast.error('Grace days must be between 0 and 30');
            return;
        }

        try {
            setSavingReject(true);
            const response = await axios.post('/api/cron/auto-reject', {
                enabled: autoRejectEnabled,
                graceDays
            });

            if (response.data.success) {
                setAutoRejectGraceDays(graceDays);
                toast.success('Auto-reject grace period updated');
            }
        } catch (error) {
            console.error('Error updating reject grace days:', error);
            toast.error(error.response?.data?.message || 'Failed to update grace period');
        } finally {
            setSavingReject(false);
        }
    };

    const handleAutoNoPickupToggle = async () => {
        try {
            setSavingNoPickup(true);
            const response = await axios.post('/api/cron/auto-no-pickup', {
                enabled: !autoNoPickupEnabled,
                days: autoNoPickupDays
            });

            if (response.data.success) {
                setAutoNoPickupEnabled(response.data.settings.enabled);
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error('Error toggling auto-no_pickup:', error);
            toast.error(error.response?.data?.message || 'Failed to toggle auto-no_pickup');
        } finally {
            setSavingNoPickup(false);
        }
    };

    const handleNoPickupDaysChange = async (newDays) => {
        const days = parseInt(newDays, 10);
        if (isNaN(days) || days < 1 || days > 30) {
            toast.error('Days must be between 1 and 30');
            return;
        }

        try {
            setSavingNoPickup(true);
            const response = await axios.post('/api/cron/auto-no-pickup', {
                enabled: autoNoPickupEnabled,
                days
            });

            if (response.data.success) {
                setAutoNoPickupDays(days);
                toast.success('Auto-no_pickup threshold updated');
            }
        } catch (error) {
            console.error('Error updating no_pickup days:', error);
            toast.error(error.response?.data?.message || 'Failed to update threshold');
        } finally {
            setSavingNoPickup(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Loading settings...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className={`rounded-2xl shadow-xl overflow-hidden ${
                isDark 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                    : 'bg-white border border-gray-200'
            }`}>
                {/* Header */}
                <div className={`px-6 py-4 border-b ${
                    isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                }`}>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Auto Status Update Settings
                    </h2>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Configure automatic status updates for overdue equipment
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Automation Toggle */}
                    <div className={`p-6 rounded-xl border ${
                        isDark 
                            ? 'bg-gray-800/50 border-gray-700' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className={`text-lg font-semibold flex items-center ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Automatic Status Updates
                                </h3>
                                <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Automatically update equipment status to "late_return" when overdue. 
                                    Runs daily at 1:00 AM (Asia/Manila timezone).
                                </p>
                                <div className={`mt-3 p-3 rounded-lg ${
                                    isDark ? 'bg-gray-900/50' : 'bg-white'
                                }`}>
                                    <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <span className="font-semibold">How it works:</span>
                                    </p>
                                    <ul className={`mt-2 space-y-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Checks all approved equipment with return dates</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Compares return dates with current date</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Automatically marks overdue items as "late_return"</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Logs all changes with timestamp and reason</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="ml-6">
                                <button
                                    onClick={handleToggleCron}
                                    className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        cronEnabled 
                                            ? 'bg-blue-600' 
                                            : isDark ? 'bg-gray-700' : 'bg-gray-300'
                                    }`}
                                    role="switch"
                                    aria-checked={cronEnabled}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            cronEnabled ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                                <div className={`mt-2 text-xs font-medium text-center ${
                                    cronEnabled 
                                        ? 'text-blue-500' 
                                        : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {cronEnabled ? 'Enabled' : 'Disabled'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Manual Trigger */}
                    <div className={`p-6 rounded-xl border ${
                        isDark 
                            ? 'bg-gray-800/50 border-gray-700' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <h3 className={`text-lg font-semibold flex items-center ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Manual Check
                        </h3>
                        <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Run the overdue check immediately without waiting for the scheduled time. 
                            Useful for testing or immediate updates.
                        </p>
                        <button
                            onClick={handleManualTrigger}
                            disabled={triggering}
                            className={`mt-4 px-6 py-2.5 rounded-xl font-semibold text-white transition-all shadow-lg ${
                                triggering
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
                            }`}
                        >
                            {triggering ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Checking...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Run Check Now
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Auto-Archive Settings */}
                    <div className={`p-6 rounded-xl border ${
                        isDark 
                            ? 'bg-gray-800/50 border-gray-700' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className={`text-lg font-semibold flex items-center ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Auto-Archive Borrowed Items
                                </h3>
                                <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Automatically archive severely overdue borrowed items after a specified number of days. 
                                    Items will be marked as "No Return" and moved to the Archive section.
                                </p>
                            </div>
                            <div className="ml-6">
                                <button
                                    onClick={handleAutoArchiveToggle}
                                    disabled={savingArchive}
                                    className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                                        autoArchiveEnabled 
                                            ? 'bg-red-600' 
                                            : isDark ? 'bg-gray-700' : 'bg-gray-300'
                                    } ${savingArchive ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    role="switch"
                                    aria-checked={autoArchiveEnabled}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            autoArchiveEnabled ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                                <div className={`mt-2 text-xs font-medium text-center ${
                                    autoArchiveEnabled 
                                        ? 'text-red-500' 
                                        : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {autoArchiveEnabled ? 'Enabled' : 'Disabled'}
                                </div>
                            </div>
                        </div>

                        {/* Days threshold input */}
                        <div className={`mt-4 p-4 rounded-lg ${
                            isDark ? 'bg-gray-900/50' : 'bg-white'
                        }`}>
                            <label className={`block text-sm font-medium mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Archive After (Days)
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={autoArchiveDays}
                                    onChange={(e) => setAutoArchiveDays(parseInt(e.target.value, 10) || 1)}
                                    onBlur={(e) => handleArchiveDaysChange(e.target.value)}
                                    disabled={savingArchive}
                                    className={`flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                        isDark 
                                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } ${savingArchive ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    days overdue
                                </span>
                            </div>
                            <p className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                                Items in the Borrowed tab that have been overdue for {autoArchiveDays} or more days will be automatically archived.
                            </p>
                        </div>

                        <div className={`mt-4 p-3 rounded-lg ${
                            isDark ? 'bg-gray-900/50' : 'bg-white'
                        }`}>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <span className="font-semibold">How it works:</span>
                            </p>
                            <ul className={`mt-2 space-y-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Runs daily at 1:00 AM alongside the late return check</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Finds items with "late_return" status older than threshold</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Automatically marks them as "No_Return"</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Items move from Borrowed to Archive section</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Auto-Reject Pending Requests Settings */}
                    <div className={`p-6 rounded-xl border ${
                        isDark 
                            ? 'bg-gray-800/50 border-gray-700' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className={`text-lg font-semibold flex items-center ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Auto-Reject Expired Pending Requests
                                </h3>
                                <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Automatically reject pending requests that have passed their pickup date. 
                                    Configure a grace period before auto-rejection occurs.
                                </p>
                            </div>
                            <div className="ml-6">
                                <button
                                    onClick={handleAutoRejectToggle}
                                    disabled={savingReject}
                                    className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                                        autoRejectEnabled 
                                            ? 'bg-purple-600' 
                                            : isDark ? 'bg-gray-700' : 'bg-gray-300'
                                    } ${savingReject ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    role="switch"
                                    aria-checked={autoRejectEnabled}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            autoRejectEnabled ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                                <div className={`mt-2 text-xs font-medium text-center ${
                                    autoRejectEnabled 
                                        ? 'text-purple-500' 
                                        : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {autoRejectEnabled ? 'Enabled' : 'Disabled'}
                                </div>
                            </div>
                        </div>

                        {/* Grace period input */}
                        <div className={`mt-4 p-4 rounded-lg ${
                            isDark ? 'bg-gray-900/50' : 'bg-white'
                        }`}>
                            <label className={`block text-sm font-medium mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Grace Period (Days)
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min="0"
                                    max="30"
                                    value={autoRejectGraceDays}
                                    onChange={(e) => setAutoRejectGraceDays(parseInt(e.target.value, 10) || 0)}
                                    onBlur={(e) => handleRejectGraceDaysChange(e.target.value)}
                                    disabled={savingReject}
                                    className={`flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                        isDark 
                                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } ${savingReject ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    days after pickup date
                                </span>
                            </div>
                            <p className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                                Pending requests will be auto-rejected {autoRejectGraceDays} day{autoRejectGraceDays !== 1 ? 's' : ''} after the scheduled pickup date passes.
                                {autoRejectGraceDays === 0 && ' (Rejects immediately on pickup date)'}
                            </p>
                        </div>

                        <div className={`mt-4 p-3 rounded-lg ${
                            isDark ? 'bg-gray-900/50' : 'bg-white'
                        }`}>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <span className="font-semibold">How it works:</span>
                            </p>
                            <ul className={`mt-2 space-y-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Runs daily at 1:00 AM alongside other automation tasks</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Checks for Pending requests where pickup date has expired</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Applies grace period before rejecting</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Automatically marks them as "Rejected" with reason logged</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Auto-No_Pickup Settings */}
                    <div className={`p-6 rounded-xl border ${
                        isDark 
                            ? 'bg-gray-800/50 border-gray-700' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className={`text-lg font-semibold flex items-center ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Auto-Mark Overdue Reservations as No Pickup
                                </h3>
                                <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Automatically mark approved reservations as "No Pickup" when users fail to collect items. 
                                    Stock is restored to inventory automatically.
                                </p>
                            </div>
                            <div className="ml-6">
                                <button
                                    onClick={handleAutoNoPickupToggle}
                                    disabled={savingNoPickup}
                                    className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                                        autoNoPickupEnabled 
                                            ? 'bg-yellow-600' 
                                            : isDark ? 'bg-gray-700' : 'bg-gray-300'
                                    } ${savingNoPickup ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    role="switch"
                                    aria-checked={autoNoPickupEnabled}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            autoNoPickupEnabled ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                                <div className={`mt-2 text-xs font-medium text-center ${
                                    autoNoPickupEnabled 
                                        ? 'text-yellow-500' 
                                        : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {autoNoPickupEnabled ? 'Enabled' : 'Disabled'}
                                </div>
                            </div>
                        </div>

                        {/* Days threshold input */}
                        <div className={`mt-4 p-4 rounded-lg ${
                            isDark ? 'bg-gray-900/50' : 'bg-white'
                        }`}>
                            <label className={`block text-sm font-medium mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Mark as No Pickup After (Days)
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={autoNoPickupDays}
                                    onChange={(e) => setAutoNoPickupDays(parseInt(e.target.value, 10) || 1)}
                                    onBlur={(e) => handleNoPickupDaysChange(e.target.value)}
                                    disabled={savingNoPickup}
                                    className={`flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                                        isDark 
                                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } ${savingNoPickup ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    days past pickup date
                                </span>
                            </div>
                            <p className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                                Approved reservations will be marked as "No Pickup" after {autoNoPickupDays} day{autoNoPickupDays !== 1 ? 's' : ''} past the scheduled pickup date.
                            </p>
                        </div>

                        <div className={`mt-4 p-3 rounded-lg ${
                            isDark ? 'bg-gray-900/50' : 'bg-white'
                        }`}>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <span className="font-semibold">How it works:</span>
                            </p>
                            <ul className={`mt-2 space-y-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Runs daily at 1:00 AM alongside other automation tasks</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Finds Approved reservations past pickup date threshold</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Automatically marks them as "No_Pickup"</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Restores reserved quantity back to item stock</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Moves items from Reserved to Archive section</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Status Info */}
                    <div className={`p-4 rounded-xl border-l-4 ${
                        cronEnabled
                            ? isDark 
                                ? 'bg-blue-900/20 border-blue-500' 
                                : 'bg-blue-50 border-blue-500'
                            : isDark
                                ? 'bg-gray-800/50 border-gray-600'
                                : 'bg-gray-50 border-gray-400'
                    }`}>
                        <div className="flex items-start">
                            <svg 
                                className={`w-5 h-5 mr-2 flex-shrink-0 mt-0.5 ${
                                    cronEnabled ? 'text-blue-500' : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${
                                    cronEnabled
                                        ? isDark ? 'text-blue-300' : 'text-blue-800'
                                        : isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Current Status: {cronEnabled ? 'Active' : 'Inactive'}
                                </p>
                                <p className={`mt-1 text-xs ${
                                    cronEnabled
                                        ? isDark ? 'text-blue-400' : 'text-blue-600'
                                        : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {cronEnabled 
                                        ? 'The system will automatically check for overdue items daily at 1:00 AM.' 
                                        : 'Automatic status updates are currently disabled. Enable to start automatic checks.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
