import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';

const FirebaseImageTest = () => {
    const { theme } = useTheme();
    const [logs, setLogs] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const logsEndRef = useRef(null);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [...prev, { message, type, timestamp }]);
    };

    const clearLogs = () => {
        setLogs([]);
        addLog('Logs cleared', 'info');
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            addLog(`File selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, 'success');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            addLog('No file selected', 'error');
            return;
        }

        setIsLoading(true);
        addLog('Starting upload...', 'info');

        try {
            const formData = new FormData();
            formData.append('photo', selectedFile);

            addLog(`Uploading to ${API_BASE}/api/account/picture/me`, 'info');
            
            const response = await axios.post(`${API_BASE}/api/account/picture/me`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            addLog(`✓ Upload successful!`, 'success');
            addLog(`Response: ${JSON.stringify(response.data)}`, 'success');
            
            if (response.data.picturePath) {
                addLog(`Firebase path: ${response.data.picturePath}`, 'info');
            }

            // Clear selection after successful upload
            setSelectedFile(null);
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Fetch the updated photo
            await handleRetrieve();
        } catch (error) {
            addLog(`✗ Upload failed: ${error.response?.data?.error || error.message}`, 'error');
            if (error.response?.status === 401) {
                addLog('Authentication required - please login first', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetrieve = async () => {
        setIsLoading(true);
        addLog('Retrieving photo...', 'info');

        try {
            addLog(`Fetching from ${API_BASE}/api/account/picture/me?format=json`, 'info');
            
            const response = await axios.get(`${API_BASE}/api/account/picture/me`, {
                params: { format: 'json' },
                withCredentials: true,
            });

            if (response.data?.url) {
                addLog(`✓ Photo URL retrieved`, 'success');
                addLog(`Firebase CDN URL: ${response.data.url}`, 'info');
                // Extract filename from URL
                const filename = response.data.url.split('/').pop().split('?')[0];
                addLog(`📁 Filename: ${decodeURIComponent(filename)}`, 'info');
                setCurrentPhotoUrl(response.data.url);
            } else {
                addLog(`✗ No photo URL in response`, 'error');
                setCurrentPhotoUrl(null);
            }
        } catch (error) {
            addLog(`✗ Retrieval failed: ${error.response?.data?.error || error.message}`, 'error');
            if (error.response?.status === 401) {
                addLog('Authentication required - please login first', 'error');
            } else if (error.response?.status === 404) {
                addLog('No photo found', 'warning');
            }
            setCurrentPhotoUrl(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete the current photo?')) {
            addLog('Delete cancelled', 'warning');
            return;
        }

        setIsLoading(true);
        addLog('Deleting photo...', 'info');

        try {
            addLog(`Deleting photo at ${API_BASE}/api/account/picture/me`, 'info');
            
            const response = await axios.delete(`${API_BASE}/api/account/picture/me`, {
                withCredentials: true,
            });

            addLog(`✓ Delete successful!`, 'success');
            addLog(`Response: ${JSON.stringify(response.data)}`, 'success');
            setCurrentPhotoUrl(null);
        } catch (error) {
            addLog(`✗ Delete failed: ${error.response?.data?.error || error.message}`, 'error');
            if (error.response?.status === 401) {
                addLog('Authentication required - please login first', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const testCachePerformance = async () => {
        addLog('Starting cache performance test...', 'info');
        const iterations = 5;
        const times = [];

        for (let i = 1; i <= iterations; i++) {
            const start = performance.now();
            try {
                await axios.get(`${API_BASE}/api/account/picture/me`, {
                    params: { format: 'json' },
                    withCredentials: true,
                });
                const end = performance.now();
                const duration = (end - start).toFixed(2);
                times.push(duration);
                addLog(`Request ${i}/${iterations}: ${duration}ms`, i === 1 ? 'warning' : 'success');
            } catch (error) {
                addLog(`Request ${i} failed: ${error.message}`, 'error');
            }
        }

        if (times.length > 1) {
            const firstRequest = times[0];
            const avgCached = (times.slice(1).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / (times.length - 1)).toFixed(2);
            addLog(`First request (uncached): ${firstRequest}ms`, 'info');
            addLog(`Average cached requests: ${avgCached}ms`, 'info');
            addLog(`Cache speedup: ${(firstRequest / avgCached).toFixed(2)}x faster`, 'success');
        }
    };

    const getLogColor = (type) => {
        switch (type) {
            case 'success':
                return theme === 'dark' ? 'text-green-400' : 'text-green-600';
            case 'error':
                return theme === 'dark' ? 'text-red-400' : 'text-red-600';
            case 'warning':
                return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
            default:
                return theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Firebase Image Upload/Delete Test
                </h3>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Test Firebase Storage integration with caching
                </p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                    {/* Left Column - Controls */}
                    <div className="space-y-6">
                        {/* File Selection */}
                        <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-white'}`}>
                            <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                1. Select Image
                            </h4>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileSelect}
                                className={`block w-full text-sm ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                } file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                                    theme === 'dark'
                                        ? 'file:bg-blue-600 file:text-white hover:file:bg-blue-700'
                                        : 'file:bg-blue-500 file:text-white hover:file:bg-blue-600'
                                }`}
                            />
                            {previewUrl && (
                                <div className="mt-3">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg border border-gray-600"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-white'}`}>
                            <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                2. Actions
                            </h4>
                            <div className="space-y-2">
                                <button
                                    onClick={handleUpload}
                                    disabled={!selectedFile || isLoading}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                                        !selectedFile || isLoading
                                            ? theme === 'dark'
                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : theme === 'dark'
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                >
                                    {isLoading ? '⏳ Uploading...' : '📤 Upload to Firebase'}
                                </button>
                                <button
                                    onClick={handleRetrieve}
                                    disabled={isLoading}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                                        isLoading
                                            ? theme === 'dark'
                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : theme === 'dark'
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                >
                                    {isLoading ? '⏳ Loading...' : '📥 Retrieve Photo'}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                                        isLoading
                                            ? theme === 'dark'
                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : theme === 'dark'
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-red-500 text-white hover:bg-red-600'
                                    }`}
                                >
                                    {isLoading ? '⏳ Deleting...' : '🗑️ Delete Photo'}
                                </button>
                                <button
                                    onClick={testCachePerformance}
                                    disabled={isLoading}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                                        isLoading
                                            ? theme === 'dark'
                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : theme === 'dark'
                                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                                            : 'bg-purple-500 text-white hover:bg-purple-600'
                                    }`}
                                >
                                    {isLoading ? '⏳ Testing...' : '⚡ Test Cache Performance'}
                                </button>
                            </div>
                        </div>

                        {/* Current Photo */}
                        <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-white'}`}>
                            <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                3. Current Photo
                            </h4>
                            {currentPhotoUrl ? (
                                <img
                                    src={currentPhotoUrl}
                                    alt="Current profile"
                                    className="w-full h-48 object-cover rounded-lg border border-gray-600"
                                    onError={(e) => {
                                        addLog('Failed to load image', 'error');
                                        setCurrentPhotoUrl(null);
                                    }}
                                />
                            ) : (
                                <div className={`w-full h-48 flex items-center justify-center rounded-lg border-2 border-dashed ${
                                    theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                                }`}>
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">📷</div>
                                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                                            No photo loaded
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Logs */}
                    <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Console Logs
                            </h4>
                            <button
                                onClick={clearLogs}
                                className={`px-3 py-1 text-xs rounded-lg ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Clear
                            </button>
                        </div>
                        <div className={`h-[500px] overflow-y-auto p-3 rounded-lg font-mono text-sm ${
                            theme === 'dark' ? 'bg-black' : 'bg-white border border-gray-200'
                        }`}>
                            {logs.length === 0 ? (
                                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                                    No logs yet...
                                </div>
                            ) : (
                                logs.map((log, index) => (
                                    <div key={index} className="mb-1">
                                        <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                                            [{log.timestamp}]
                                        </span>{' '}
                                        <span className={getLogColor(log.type)}>{log.message}</span>
                                    </div>
                                ))
                            )}
                            <div ref={logsEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FirebaseImageTest;
