import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import {
    Chart,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    BarElement,
    ArcElement,
    DoughnutController,
    PieController,
    Filler,
} from 'chart.js';

Chart.register(
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    BarElement,
    ArcElement,
    DoughnutController,
    PieController,
    Filler
);

function SeedTrackingAnalytics() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    // State
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    
    // Data states
    const [stats, setStats] = useState({
        totalCrops: 0,
        activeCrops: 0,
        completedCrops: 0,
        totalReports: 0,
        avgStageProgress: 0,
        healthyCrops: 0,
        cropsWithIssues: 0,
        totalFarmersParticipating: 0,
    });
    
    const [cropTypes, setCropTypes] = useState([]);
    const [cropsByStatus, setCropsByStatus] = useState([]);
    const [cropsByStage, setCropsByStage] = useState([]);
    const [healthStatusDistribution, setHealthStatusDistribution] = useState([]);
    const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
    const [monthlyReports, setMonthlyReports] = useState([]);
    const [topCrops, setTopCrops] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    
    // Chart refs
    const statusChartRef = useRef(null);
    const healthChartRef = useRef(null);
    const registrationsChartRef = useRef(null);
    const reportsChartRef = useRef(null);
    const stageProgressChartRef = useRef(null);
    
    // Fetch data
    useEffect(() => {
        fetchAnalyticsData();
    }, [statusFilter, fromDate, toDate]);
    
    const fetchAnalyticsData = async () => {
        setIsLoading(true);
        try {
            // Build query params
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (fromDate) params.append('from', fromDate);
            if (toDate) params.append('to', toDate);
            
            // Fetch all crops with reports
            const cropsResponse = await fetch(`/api/seed-track/crops?includeReports=true&${params.toString()}`);
            const cropsData = await cropsResponse.json();
            const crops = cropsData.data || [];
            
            // Fetch all reports
            const reportsResponse = await fetch(`/api/seed-track/reports?${params.toString()}`);
            const reportsData = await reportsResponse.json();
            const reports = reportsData.data || [];
            
            // Calculate stats
            const activeCrops = crops.filter(c => c.status === 'Active').length;
            const completedCrops = crops.filter(c => c.status === 'Completed').length;
            
            // Health status from latest reports
            const healthyCount = reports.filter(r => 
                r.healthStatus?.toLowerCase() === 'healthy' || 
                r.healthStatus?.toLowerCase() === 'excellent'
            ).length;
            const issuesCount = reports.filter(r => 
                r.healthStatus?.toLowerCase() === 'poor' || 
                r.healthStatus?.toLowerCase() === 'diseased' ||
                r.pestsObserved || r.diseasesObserved
            ).length;
            
            // Unique farmers
            const uniqueFarmers = new Set(crops.map(c => c.userId)).size;
            
            // Average stage progress
            const avgProgress = crops.length > 0 
                ? crops.reduce((sum, c) => sum + (c.currentStageIndex || 0), 0) / crops.length 
                : 0;
            
            setStats({
                totalCrops: crops.length,
                activeCrops,
                completedCrops,
                totalReports: reports.length,
                avgStageProgress: Math.round(avgProgress * 100) / 100,
                healthyCrops: healthyCount,
                cropsWithIssues: issuesCount,
                totalFarmersParticipating: uniqueFarmers,
            });
            
            // Crop types distribution
            const typeGroups = {};
            crops.forEach(c => {
                const type = c.cropType || 'Unknown';
                typeGroups[type] = (typeGroups[type] || 0) + 1;
            });
            setCropTypes(Object.entries(typeGroups).map(([name, count]) => ({ name, count })));
            
            // Crops by status
            const statusGroups = { Active: 0, Completed: 0, Archived: 0 };
            crops.forEach(c => {
                statusGroups[c.status] = (statusGroups[c.status] || 0) + 1;
            });
            setCropsByStatus(Object.entries(statusGroups).map(([name, count]) => ({ name, count })));
            
            // Crops by current stage
            const stageGroups = {};
            crops.forEach(c => {
                const stage = c.currentStageName || 'Not Started';
                stageGroups[stage] = (stageGroups[stage] || 0) + 1;
            });
            setCropsByStage(Object.entries(stageGroups).map(([name, count]) => ({ name, count })));
            
            // Health status distribution
            const healthGroups = {};
            reports.forEach(r => {
                const health = r.healthStatus || 'Unknown';
                healthGroups[health] = (healthGroups[health] || 0) + 1;
            });
            setHealthStatusDistribution(Object.entries(healthGroups).map(([name, count]) => ({ name, count })));
            
            // Monthly registrations (last 6 months)
            const monthlyReg = {};
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                monthlyReg[key] = 0;
            }
            crops.forEach(c => {
                const date = new Date(c.createdAt);
                const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                if (monthlyReg[key] !== undefined) {
                    monthlyReg[key]++;
                }
            });
            setMonthlyRegistrations(Object.entries(monthlyReg).map(([month, count]) => ({ month, count })));
            
            // Monthly reports (last 6 months)
            const monthlyRep = {};
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                monthlyRep[key] = 0;
            }
            reports.forEach(r => {
                const date = new Date(r.createdAt);
                const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                if (monthlyRep[key] !== undefined) {
                    monthlyRep[key]++;
                }
            });
            setMonthlyReports(Object.entries(monthlyRep).map(([month, count]) => ({ month, count })));
            
            // Top crops by report count
            const cropReportCount = {};
            reports.forEach(r => {
                const crop = crops.find(c => c.id === r.cropId);
                if (crop) {
                    const key = `${crop.cropType} - ${crop.variety}`;
                    cropReportCount[key] = (cropReportCount[key] || 0) + 1;
                }
            });
            const sortedCrops = Object.entries(cropReportCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));
            setTopCrops(sortedCrops);
            
            // Recent activity (last 10 crops)
            const recent = crops
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10)
                .map(c => ({
                    id: c.id,
                    cropType: c.cropType,
                    variety: c.variety,
                    status: c.status,
                    stage: c.currentStageName,
                    date: new Date(c.createdAt).toLocaleDateString(),
                }));
            setRecentActivity(recent);
            
        } catch (error) {
            console.error('Error fetching seed tracking analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Initialize charts
    const initChart = (ref, type, data, options) => {
        if (!ref.current) return;
        
        const ctx = ref.current.getContext('2d');
        if (ref.current.chart) {
            ref.current.chart.destroy();
        }
        
        ref.current.chart = new Chart(ctx, {
            type,
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                ...options,
            },
        });
    };
    
    // Chart effects
    useEffect(() => {
        if (isLoading) return;
        
        // Status chart
        if (cropsByStatus.length > 0) {
            initChart(statusChartRef, 'doughnut', {
                labels: cropsByStatus.map(s => s.name),
                datasets: [{
                    data: cropsByStatus.map(s => s.count),
                    backgroundColor: ['#10b981', '#3b82f6', '#6b7280'],
                    borderWidth: 2,
                    borderColor: isDark ? '#1f2937' : '#ffffff',
                }],
            }, {
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: isDark ? '#d1d5db' : '#374151',
                            padding: 15,
                            usePointStyle: true,
                        }
                    },
                },
            });
        }
        
        // Health chart
        if (healthStatusDistribution.length > 0) {
            initChart(healthChartRef, 'pie', {
                labels: healthStatusDistribution.map(h => h.name),
                datasets: [{
                    data: healthStatusDistribution.map(h => h.count),
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'],
                    borderWidth: 2,
                    borderColor: isDark ? '#1f2937' : '#ffffff',
                }],
            }, {
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: isDark ? '#d1d5db' : '#374151',
                            padding: 15,
                            usePointStyle: true,
                        }
                    },
                },
            });
        }
        
        // Registrations chart
        if (monthlyRegistrations.length > 0) {
            initChart(registrationsChartRef, 'line', {
                labels: monthlyRegistrations.map(m => m.month),
                datasets: [{
                    label: 'Crop Registrations',
                    data: monthlyRegistrations.map(m => m.count),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                }],
            }, {
                plugins: {
                    legend: {
                        labels: {
                            color: isDark ? '#d1d5db' : '#374151',
                        }
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                        ticks: { color: isDark ? '#d1d5db' : '#6b7280' },
                    },
                    x: {
                        grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                        ticks: { color: isDark ? '#d1d5db' : '#6b7280' },
                    },
                },
            });
        }
        
        // Reports chart
        if (monthlyReports.length > 0) {
            initChart(reportsChartRef, 'bar', {
                labels: monthlyReports.map(m => m.month),
                datasets: [{
                    label: 'Monthly Reports',
                    data: monthlyReports.map(m => m.count),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                }],
            }, {
                plugins: {
                    legend: {
                        labels: {
                            color: isDark ? '#d1d5db' : '#374151',
                        }
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                        ticks: { color: isDark ? '#d1d5db' : '#6b7280' },
                    },
                    x: {
                        grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                        ticks: { color: isDark ? '#d1d5db' : '#6b7280' },
                    },
                },
            });
        }
        
        // Stage progress chart
        if (cropsByStage.length > 0) {
            initChart(stageProgressChartRef, 'bar', {
                labels: cropsByStage.map(s => s.name),
                datasets: [{
                    label: 'Crops by Stage',
                    data: cropsByStage.map(s => s.count),
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: '#10b981',
                    borderWidth: 2,
                }],
            }, {
                indexAxis: 'y',
                plugins: {
                    legend: {
                        labels: {
                            color: isDark ? '#d1d5db' : '#374151',
                        }
                    },
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                        ticks: { color: isDark ? '#d1d5db' : '#6b7280' },
                    },
                    y: {
                        grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                        ticks: { color: isDark ? '#d1d5db' : '#6b7280' },
                    },
                },
            });
        }
        
    }, [isLoading, cropsByStatus, healthStatusDistribution, monthlyRegistrations, monthlyReports, cropsByStage, isDark]);
    
    // Cleanup
    useEffect(() => {
        return () => {
            [statusChartRef, healthChartRef, registrationsChartRef, reportsChartRef, stageProgressChartRef].forEach(ref => {
                if (ref.current?.chart) {
                    ref.current.chart.destroy();
                }
            });
        };
    }, []);
    
    // Export to CSV
    const exportToCSV = () => {
        const csvData = [
            ['Seed Tracking Analytics Report'],
            [''],
            ['Overall Statistics'],
            ['Metric', 'Value'],
            ['Total Crops', stats.totalCrops],
            ['Active Crops', stats.activeCrops],
            ['Completed Crops', stats.completedCrops],
            ['Total Reports', stats.totalReports],
            ['Avg Stage Progress', stats.avgStageProgress],
            ['Healthy Crops', stats.healthyCrops],
            ['Crops with Issues', stats.cropsWithIssues],
            ['Farmers Participating', stats.totalFarmersParticipating],
            [''],
            ['Crops by Type'],
            ['Crop Type', 'Count'],
            ...cropTypes.map(t => [t.name, t.count]),
            [''],
            ['Monthly Registrations'],
            ['Month', 'Count'],
            ...monthlyRegistrations.map(m => [m.month, m.count]),
        ];
        
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seed-tracking-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };
    
    return (
        <div className={`min-h-screen sm:mt-10 flex justify-center items-start py-12 px-4 sm:px-8 ${
            isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gray-50'
        }`}>
            <div className={`w-full max-w-7xl mx-auto rounded-2xl shadow-xl p-6 md:p-10 border ${
                isDark ? 'bg-gray-800/90 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Seed Tracking Analytics
                                </h1>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Monitor crop registration, health, and progression
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={exportToCSV}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                    
                    {/* Filters */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-lg ${
                        isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`rounded-lg px-3 py-2 border focus:ring-2 focus:ring-green-500 ${
                                isDark ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Archived">Archived</option>
                        </select>
                        
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className={`rounded-lg px-3 py-2 border focus:ring-2 focus:ring-green-500 ${
                                isDark ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="From"
                        />
                        
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className={`rounded-lg px-3 py-2 border focus:ring-2 focus:ring-green-500 ${
                                isDark ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="To"
                        />
                        
                        <button
                            onClick={() => { setFromDate(''); setToDate(''); setStatusFilter('all'); }}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                                isDark ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                            }`}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className={`rounded-xl p-6 shadow-lg border ${
                                isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.totalCrops}
                                </h3>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Total Crops
                                </p>
                            </div>
                            
                            <div className={`rounded-xl p-6 shadow-lg border ${
                                isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.activeCrops}
                                </h3>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Active Crops
                                </p>
                            </div>
                            
                            <div className={`rounded-xl p-6 shadow-lg border ${
                                isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.totalReports}
                                </h3>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Total Reports
                                </p>
                            </div>
                            
                            <div className={`rounded-xl p-6 shadow-lg border ${
                                isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.totalFarmersParticipating}
                                </h3>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Farmers
                                </p>
                            </div>
                        </div>
           
                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className={`rounded-xl p-6 shadow-lg border ${
                                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                            }`}>
                                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Crops by Status
                                </h3>
                                <div className="h-64">
                                    <canvas ref={statusChartRef}></canvas>
                                </div>
                            </div>
                            
                            <div className={`rounded-xl p-6 shadow-lg border ${
                                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                            }`}>
                                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Health Status Distribution
                                </h3>
                                <div className="h-64">
                                    <canvas ref={healthChartRef}></canvas>
                                </div>
                            </div>
                            
                            <div className={`rounded-xl p-6 shadow-lg border lg:col-span-2 ${
                                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                            }`}>
                                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Monthly Crop Registrations
                                </h3>
                                <div className="h-64">
                                    <canvas ref={registrationsChartRef}></canvas>
                                </div>
                            </div>
     
                        </div>
                        
                        {/* Tables */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
                            <div className={`rounded-xl p-6 shadow-lg border row-span-4 col-span-2 ${
                                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                            }`}>
                                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Recent Activity
                                </h3>
                                <div className="space-y-3">
                                    {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((activity, idx) => (
                                        <div key={idx} className={`p-3 rounded-lg ${
                                            isDark ? 'bg-gray-600' : 'bg-gray-50'
                                        }`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                                    {activity.cropType} - {activity.variety}
                                                </span>
                                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {activity.date}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                    activity.status === 'Active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : activity.status === 'Completed'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {activity.status}
                                                </span>
                                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {activity.stage}
                                                </span>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            No recent activity
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default SeedTrackingAnalytics;
