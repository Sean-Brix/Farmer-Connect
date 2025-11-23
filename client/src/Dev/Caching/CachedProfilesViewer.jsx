import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getImageCacheStats, clearImageCache, clearAllImageCache } from '../../hooks/useImageCache';

const CachedProfilesViewer = () => {
    const { theme } = useTheme();
    const [cacheStats, setCacheStats] = useState({ size: 0, entries: [] });
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshCache = () => {
        const stats = getImageCacheStats();
        setCacheStats(stats);
    };

    useEffect(() => {
        refreshCache();
        // Auto-refresh every 2 seconds
        const interval = setInterval(refreshCache, 2000);
        return () => clearInterval(interval);
    }, [refreshKey]);

    const handleClearSingle = (userId) => {
        clearImageCache(userId);
        setRefreshKey(prev => prev + 1);
    };

    const handleClearAll = () => {
        if (confirm('Are you sure you want to clear all cached profile images?')) {
            clearAllImageCache();
            setRefreshKey(prev => prev + 1);
        }
    };

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        
        return date.toLocaleString();
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            📦 Cached Profile Images
                        </h2>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            View and manage client-side cached user profile images
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setRefreshKey(prev => prev + 1)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                                theme === 'dark'
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            <i className="fa-solid fa-refresh"></i>
                            <span>Refresh</span>
                        </button>
                        <button
                            onClick={handleClearAll}
                            disabled={cacheStats.size === 0}
                            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                                cacheStats.size === 0
                                    ? theme === 'dark'
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : theme === 'dark'
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                        >
                            <i className="fa-solid fa-trash"></i>
                            <span>Clear All</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="grid grid-cols-4 gap-4">
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Total Cached
                        </div>
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {cacheStats.size}
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Loaded Images
                        </div>
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {cacheStats.entries.filter(e => e.url && !e.url.includes('default')).length}
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Default Images
                        </div>
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {cacheStats.entries.filter(e => e.url && e.url.includes('default')).length}
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Avg. Load Time
                        </div>
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {cacheStats.entries.length > 0
                                ? `${(cacheStats.entries.reduce((sum, e) => sum + (e.loadTime || 0), 0) / cacheStats.entries.length).toFixed(0)}ms`
                                : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cache Entries Table */}
            <div className="flex-1 overflow-auto p-6">
                {cacheStats.size === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🗃️</div>
                            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                No Cached Images
                            </h3>
                            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                                Profile images will appear here once they are loaded
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className={`w-full ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        User ID
                                    </th>
                                    <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        URL Preview
                                    </th>
                                    <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Cached At
                                    </th>
                                    <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Load Time
                                    </th>
                                    <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Source
                                    </th>
                                    <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cacheStats.entries.map((entry) => (
                                    <tr
                                        key={entry.userId}
                                        className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}
                                    >
                                        <td className="px-4 py-3">
                                            <span className={`font-mono text-sm px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                                #{entry.userId}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-2">
                                                <img
                                                    src={entry.url}
                                                    alt={`User ${entry.userId}`}
                                                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                                                    onError={(e) => {
                                                        e.target.src = '/default_picture.png';
                                                    }}
                                                />
                                                <span className={`text-xs truncate max-w-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {entry.url?.substring(0, 50)}...
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {formatTimestamp(entry.timestamp)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {entry.loadTime ? (
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    entry.loadTime < 100
                                                        ? theme === 'dark'
                                                            ? 'bg-green-900 text-green-300'
                                                            : 'bg-green-100 text-green-700'
                                                        : entry.loadTime < 500
                                                        ? theme === 'dark'
                                                            ? 'bg-yellow-900 text-yellow-300'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        : theme === 'dark'
                                                        ? 'bg-red-900 text-red-300'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {entry.loadTime}ms
                                                </span>
                                            ) : (
                                                <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                                                    N/A
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {entry.url?.includes('default') ? (
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                                    Default
                                                </span>
                                            ) : entry.url?.includes('firebase') ? (
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>
                                                    Firebase
                                                </span>
                                            ) : (
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                                                    Custom
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleClearSingle(entry.userId)}
                                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                                    theme === 'dark'
                                                        ? 'bg-red-900 text-red-300 hover:bg-red-800'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                            >
                                                <i className="fa-solid fa-trash mr-1"></i>
                                                Clear
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className={`px-6 py-3 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between text-sm">
                    <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        <i className="fa-solid fa-info-circle mr-2"></i>
                        Images are cached in browser memory for faster loading
                    </div>
                    <div className={`font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CachedProfilesViewer;
