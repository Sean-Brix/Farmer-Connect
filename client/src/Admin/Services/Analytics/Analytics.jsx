import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { analyticsAPI } from './analyticsAPI';
import OverviewAnalytics from './components/OverviewAnalytics.jsx';
import UsersAnalytics from './components/UsersAnalytics.jsx';
import SeminarsAnalytics from './components/SeminarsAnalytics.jsx';
import EICAnalytics from './components/EICAnalytics.jsx';
import DistributionAnalytics from './components/DistributionAnalytics.jsx';
import InventoryAnalytics from './components/InventoryAnalytics.jsx';
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
    RadialLinearScale,
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
    RadialLinearScale,
    Filler
);

// Analytics Components
const OverviewCard = ({
    title,
    value,
    change,
    icon,
    color,
    onClick,
    isActive,
    isDark,
}) => (
    <div
        className={`rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
            isDark 
                ? `bg-gray-700 ${isActive ? 'ring-2 ring-green-400 bg-gray-600' : ''}` 
                : `bg-white ${isActive ? 'ring-2 ring-green-500 bg-green-50' : ''}`
        }`}
        onClick={onClick}
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
                <div className="w-6 h-6 text-white">{icon}</div>
            </div>
            <div
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                    change >= 0
                        ? 'text-green-700 bg-green-100'
                        : 'text-red-700 bg-red-100'
                }`}
            >
                {change >= 0 ? '+' : ''}
                {change}%
            </div>
        </div>
        <h3 className={`text-2xl font-bold mb-1 ${
            isDark ? 'text-white' : 'text-gray-900'
        }`}>
            {value.toLocaleString()}
        </h3>
        <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>{title}</p>
    </div>
);

const FeatureCard = ({
    title,
    description,
    icon,
    color,
    onClick,
    isActive,
    stats,
    isDark,
}) => (
    <div
        className={`rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
            isDark 
                ? `bg-gray-700 ${isActive ? 'ring-2 ring-green-400 bg-gray-600' : ''}` 
                : `bg-white ${isActive ? 'ring-2 ring-green-500 bg-green-50' : ''}`
        }`}
        onClick={onClick}
    >
        <div className="flex items-center mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${color} mr-4`}>
                <div className="w-6 h-6 text-white">{icon}</div>
            </div>
            <div>
                <h3 className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                }`}>{title}</h3>
                <p className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>{description}</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                    <div className={`text-xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        {stat.value}
                    </div>
                    <div className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{stat.label}</div>
                </div>
            ))}
        </div>
    </div>
);

const ChartContainer = ({ title, children, className = '', isDark }) => (
    <div className={`rounded-xl shadow-md p-6 ${className} ${
        isDark ? 'bg-gray-700' : 'bg-white'
    }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
        }`}>{title}</h3>
        {children}
    </div>
);

function Analytics() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeView, setActiveView] = useState('overview');
    const [timeRange, setTimeRange] = useState('30d');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Data states
    const [overviewData, setOverviewData] = useState({});
    const [usersData, setUsersData] = useState({});
    const [seminarsData, setSeminarsData] = useState({});
    const [eicData, setEicData] = useState({});
    const [distributionData, setDistributionData] = useState({});
    const [inventoryData, setInventoryData] = useState({});

    // Chart refs
    const overviewChartRef = useRef(null);
    const featureChartRef = useRef(null);

    // Feature definitions
    const features = [
        {
            id: 'users',
            title: 'User Management',
            description: 'Track user registrations, activity, and demographics',
            icon: (
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
            ),
            color: 'from-green-500 to-green-600',
            stats: [
                { value: '1,234', label: 'Total Users' },
                { value: '89', label: 'Active Today' },
                { value: '15%', label: 'Growth Rate' },
                { value: '456', label: 'New This Month' },
            ],
        },
        {
            id: 'seminars',
            title: 'Seminar Analytics',
            description:
                'Monitor seminar performance, attendance, and feedback',
            icon: (
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            color: 'from-green-500 to-green-600',
            stats: [
                { value: '45', label: 'Total Seminars' },
                { value: '12', label: 'This Month' },
                { value: '87%', label: 'Completion Rate' },
                { value: '4.8', label: 'Avg Rating' },
            ],
        },
        {
            id: 'eic',
            title: 'EIC Management',
            description: 'Track EIC distribution, categories, and utilization',
            icon: (
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
            ),
            color: 'from-yellow-500 to-orange-500',
            stats: [
                { value: '2,456', label: 'Available EIC' },
                { value: '789', label: 'Distributed' },
                { value: '67%', label: 'Utilization' },
                { value: '8', label: 'Categories' },
            ],
        },
        {
            id: 'distribution',
            title: 'Distribution Analytics',
            description: 'Monitor distribution requests and fulfillment rates',
            icon: (
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
            ),
            color: 'from-purple-500 to-purple-600',
            stats: [
                { value: '156', label: 'Pending Requests' },
                { value: '543', label: 'Completed' },
                { value: '92%', label: 'Success Rate' },
                { value: '2.3d', label: 'Avg Time' },
            ],
        },
        {
            id: 'inventory',
            title: 'Inventory Tracking',
            description: 'Monitor stock levels, movements, and optimization',
            icon: (
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9a1 1 0 112 0v6a1 1 0 11-2 0V9zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V9z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            color: 'from-indigo-500 to-indigo-600',
            stats: [
                { value: '1,892', label: 'Items in Stock' },
                { value: '234', label: 'Low Stock' },
                { value: '45', label: 'Out of Stock' },
                { value: '₱125k', label: 'Total Value' },
            ],
        },
    ];

    // Fetch real analytics
    useEffect(() => {
        let cancelled = false;
    const fetchAll = async () => {
            setIsLoading(true);
            try {
        const params = {};
        if (from) params.from = from;
        if (to) params.to = to;
                const [ov, us, se, ei, di, iv] = await Promise.all([
            analyticsAPI.overview(params),
            analyticsAPI.users(params),
            analyticsAPI.seminars(params),
            analyticsAPI.eic(params),
            analyticsAPI.distribution(params),
            analyticsAPI.inventory(params),
                ]);
                if (cancelled) return;
                setOverviewData({
                    totalUsers: ov.payload.totalUsers,
                    totalSeminars: ov.payload.totalSeminars,
                    totalEIC: ov.payload.totalEIC,
                    totalDistributions: ov.payload.totalDistributions,
                    totalInventoryItems: ov.payload.totalInventoryItems,
                    userGrowth: ov.payload.userGrowth,
                    seminarGrowth: ov.payload.seminarGrowth,
                    eicGrowth: ov.payload.eicGrowth,
                    distributionGrowth: ov.payload.distributionGrowth,
                    inventoryGrowth: ov.payload.inventoryGrowth,
                });
                setUsersData(us.payload);
                setSeminarsData(se.payload);
                setEicData(ei.payload);
                setDistributionData(di.payload);
                setInventoryData(iv.payload);
            } catch (e) {
                console.error('Error fetching analytics data:', e);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        fetchAll();
        return () => { cancelled = true; };
    }, [timeRange, from, to]);

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <OverviewCard
                    title="Total Users"
                    value={overviewData.totalUsers || 0}
                    change={overviewData.userGrowth || 0}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                    }
                    color="from-green-500 to-green-600"
                    isDark={isDark}
                />
                <OverviewCard
                    title="Total Seminars"
                    value={overviewData.totalSeminars || 0}
                    change={overviewData.seminarGrowth || 0}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    }
                    color="from-green-500 to-green-600"
                    isDark={isDark}
                />
                <OverviewCard
                    title="Available EIC"
                    value={overviewData.totalEIC || 0}
                    change={overviewData.eicGrowth || 0}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                        </svg>
                    }
                    color="from-yellow-500 to-orange-500"
                    isDark={isDark}
                />
                <OverviewCard
                    title="Distributions"
                    value={overviewData.totalDistributions || 0}
                    change={overviewData.distributionGrowth || 0}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                        </svg>
                    }
                    color="from-purple-500 to-purple-600"
                    isDark={isDark}
                />
                <OverviewCard
                    title="Inventory Items"
                    value={overviewData.totalInventoryItems || 0}
                    change={overviewData.inventoryGrowth || 0}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9a1 1 0 112 0v6a1 1 0 11-2 0V9zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V9z"
                                clipRule="evenodd"
                            />
                        </svg>
                    }
                    color="from-indigo-500 to-indigo-600"
                    isDark={isDark}
                />
            </div>

            {/* Overview Chart */}
            <ChartContainer
                title="Platform Growth Overview"
                className="col-span-full"
                isDark={isDark}
            >
                <div className="h-96 w-full">
                    <canvas ref={overviewChartRef} style={{ width: '100%', height: '100%' }} />
                </div>
            </ChartContainer>
        </div>
    );

    const renderFeatureAnalytics = () => {
        switch (activeView) {
            case 'users':
                return <UsersAnalytics data={usersData} onExport={analyticsAPI.export.users} />;
            case 'seminars':
                return <SeminarsAnalytics data={seminarsData} onExport={analyticsAPI.export.seminars} />;
            case 'eic':
                return <EICAnalytics data={eicData} onExport={analyticsAPI.export.eic} />;
            case 'distribution':
                return <DistributionAnalytics data={distributionData} onExport={analyticsAPI.export.distribution} />;
            case 'inventory':
                return <InventoryAnalytics data={inventoryData} onExport={analyticsAPI.export.inventory} />;
            default:
                return null;
        }
    };

    // Chart initialization and cleanup
    const initializeCharts = (chartRef, type, data, options) => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy existing chart
            if (chartRef.current.chart) {
                chartRef.current.chart.destroy();
            }

            // Create new chart
            chartRef.current.chart = new Chart(ctx, {
                type,
                data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    resizeDelay: 100,
                    animation: {
                        duration: 750,
                        easing: 'easeInOutQuart'
                    },
                    layout: {
                        padding: {
                            top: 10,
                            bottom: 10,
                            left: 10,
                            right: 10
                        }
                    },
                    ...options,
                },
            });
        }
    };

    // Chart effects
    useEffect(() => {
        if (activeView === 'overview' && !isLoading) {
            // Overview combined chart
            const chartData = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Users',
                        data: usersData.monthlyRegistrations || [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                    },
                    {
                        label: 'Seminars',
                        data: seminarsData.monthly || [],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true,
                    },
                    {
                        label: 'Distributions',
                        data: distributionData.monthly || [],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                    },
                ],
            };

            initializeCharts(overviewChartRef, 'line', chartData, {
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: isDark ? '#d1d5db' : '#374151',
                            font: {
                                size: 12,
                                family: 'Inter, system-ui, sans-serif'
                            },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        },
                        ticks: {
                            color: isDark ? '#d1d5db' : '#6b7280',
                            font: {
                                size: 11,
                                family: 'Inter, system-ui, sans-serif'
                            }
                        },
                        border: {
                            color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
                        }
                    },
                    x: {
                        grid: {
                            color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        },
                        ticks: {
                            color: isDark ? '#d1d5db' : '#6b7280',
                            font: {
                                size: 11,
                                family: 'Inter, system-ui, sans-serif'
                            }
                        },
                        border: {
                            color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
                        }
                    },
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6,
                        borderWidth: 2
                    },
                    line: {
                        borderWidth: 3
                    }
                }
            });
        }
    }, [activeView, isLoading, usersData, seminarsData, distributionData, isDark]);

    useEffect(() => {
        if (activeView !== 'overview' && !isLoading) {
            let chartData,
                chartType,
                chartOptions = {};

            switch (activeView) {
                case 'users':
                    chartData = {
                        labels: [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                        ],
                        datasets: [
                            {
                                label: 'User Registrations',
                                data: usersData.monthlyRegistrations || [],
                                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                borderColor: '#3b82f6',
                                borderWidth: 2,
                            },
                        ],
                    };
                    chartType = 'bar';
                    chartOptions = {
                        plugins: {
                            legend: {
                                labels: {
                                    color: isDark ? '#d1d5db' : '#374151',
                                    font: {
                                        size: 12,
                                        family: 'Inter, system-ui, sans-serif'
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                },
                                ticks: {
                                    color: isDark ? '#d1d5db' : '#6b7280',
                                },
                                border: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
                                }
                            },
                            x: {
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                },
                                ticks: {
                                    color: isDark ? '#d1d5db' : '#6b7280',
                                },
                                border: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
                                }
                            }
                        }
                    };
                    break;

                case 'seminars':
                    chartData = {
                        labels: [
                            'Farming',
                            'Technology',
                            'Business',
                            'Marketing',
                            'Others',
                        ],
                        datasets: [
                            {
                                data: [25, 12, 8, 6, 4],
                                backgroundColor: [
                                    '#10b981',
                                    '#3b82f6',
                                    '#f59e0b',
                                    '#ef4444',
                                    '#8b5cf6',
                                ],
                            },
                        ],
                    };
                    chartType = 'doughnut';
                    chartOptions = {
                        cutout: '60%',
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: isDark ? '#d1d5db' : '#374151',
                                    font: {
                                        size: 12,
                                        family: 'Inter, system-ui, sans-serif'
                                    },
                                    padding: 20,
                                    usePointStyle: true
                                }
                            },
                        },
                    };
                    break;

                case 'eic':
                    chartData = {
                        labels: [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                        ],
                        datasets: [
                            {
                                label: 'EIC Distribution',
                                data: eicData.monthlyDistribution || [],
                                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                                borderColor: '#f59e0b',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.4,
                            },
                        ],
                    };
                    chartType = 'line';
                    chartOptions = {
                        plugins: {
                            legend: {
                                labels: {
                                    color: isDark ? '#d1d5db' : '#374151',
                                    font: {
                                        size: 12,
                                        family: 'Inter, system-ui, sans-serif'
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                },
                                ticks: {
                                    color: isDark ? '#d1d5db' : '#6b7280',
                                },
                                border: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
                                }
                            },
                            x: {
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                },
                                ticks: {
                                    color: isDark ? '#d1d5db' : '#6b7280',
                                },
                                border: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
                                }
                            }
                        },
                        elements: {
                            point: {
                                radius: 4,
                                hoverRadius: 6,
                                borderWidth: 2
                            }
                        }
                    };
                    break;

                case 'distribution':
                    chartData = {
                        labels: [
                            'Pending',
                            'Processing',
                            'Completed',
                            'Cancelled',
                        ],
                        datasets: [
                            {
                                data: [156, 89, 543, 23],
                                backgroundColor: [
                                    '#ef4444',
                                    '#f59e0b',
                                    '#10b981',
                                    '#6b7280',
                                ],
                            },
                        ],
                    };
                    chartType = 'pie';
                    chartOptions = {
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: isDark ? '#d1d5db' : '#374151',
                                    font: {
                                        size: 12,
                                        family: 'Inter, system-ui, sans-serif'
                                    },
                                    padding: 20,
                                    usePointStyle: true
                                }
                            },
                        },
                    };
                    break;

                case 'inventory':
                    chartData = {
                        labels: [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                        ],
                        datasets: [
                            {
                                label: 'Stock Levels',
                                data: inventoryData.stockLevels || [],
                                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                                borderColor: '#6366f1',
                                borderWidth: 2,
                            },
                        ],
                    };
                    chartType = 'bar';
                    chartOptions = {
                        plugins: {
                            legend: {
                                labels: {
                                    color: isDark ? '#d1d5db' : '#374151',
                                    font: {
                                        size: 12,
                                        family: 'Inter, system-ui, sans-serif'
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                },
                                ticks: {
                                    color: isDark ? '#d1d5db' : '#6b7280',
                                },
                                border: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
                                }
                            },
                            x: {
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                },
                                ticks: {
                                    color: isDark ? '#d1d5db' : '#6b7280',
                                },
                                border: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
                                }
                            }
                        }
                    };
                    break;

                default:
                    return;
            }

            initializeCharts(
                featureChartRef,
                chartType,
                chartData,
                chartOptions
            );
        }
    }, [
        activeView,
        isLoading,
        usersData,
        seminarsData,
        eicData,
        distributionData,
        inventoryData,
        isDark
    ]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (overviewChartRef.current?.chart) {
                overviewChartRef.current.chart.destroy();
            }
            if (featureChartRef.current?.chart) {
                featureChartRef.current.chart.destroy();
            }
        };
    }, []);

    return (
        <div className={`min-h-screen sm:mt-10 flex justify-center items-start py-12 px-4 sm:px-8 md:px-12 lg:px-16 ${
            isDark 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
                : 'bg-white'
        }`}>
            <div className={`w-full max-w-4xl xl:max-w-6xl 2xl:max-w-6xl mx-auto rounded-2xl shadow-xl p-8 md:p-12 lg:p-14 border ${
                isDark 
                    ? 'bg-gray-800/80 border-gray-600' 
                    : 'bg-white/80 border-gray-200'
            }`}>
                {/* Header (title section removed as requested) */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                        {/* Title section removed */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <div className="relative">
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className={`appearance-none border rounded-lg pl-4 pr-10 py-2 shadow-md focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-200 hover:border-green-400 outline-none cursor-pointer text-base font-medium ${
                                        isDark 
                                            ? 'bg-gray-700 border-gray-600 text-gray-200 hover:border-green-500' 
                                            : 'bg-white border-gray-300 text-gray-700 hover:border-green-400'
                                    }`}
                                >
                                    <option value="7d">Last 7 days</option>
                                    <option value="30d">Last 30 days</option>
                                    <option value="90d">Last 90 days</option>
                                    <option value="1y">Last year</option>
                                </select>
                                <span className={`pointer-events-none absolute inset-y-0 right-3 flex items-center ${
                                    isDark ? 'text-gray-400' : 'text-gray-400'
                                }`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-4 w-full sm:w-auto sm:ml-auto">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                                    className={`w-full sm:w-auto border rounded-lg px-3 py-2 shadow-md focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-200 outline-none ${
                                        isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'
                                    }`} />
                                <span className={`hidden sm:inline ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>to</span>
                                <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                                    className={`w-full sm:w-auto border rounded-lg px-3 py-2 shadow-md focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-200 outline-none ${
                                        isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'
                                    }`} />
                                <button onClick={() => { setFrom(''); setTo(''); }}
                                    className={`w-full sm:w-auto px-3 py-2 rounded-lg shadow transition-colors ${
                                        isDark 
                                            ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                    }`}>
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className={`flex flex-wrap gap-1 p-2 rounded-lg shadow-sm ${
                        isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                        <button
                            onClick={() => setActiveView('overview')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                activeView === 'overview'
                                    ? isDark 
                                        ? 'bg-gray-800 text-green-400 shadow-sm' 
                                        : 'bg-white text-green-600 shadow-sm'
                                    : isDark
                                        ? 'text-gray-300 hover:text-gray-100'
                                        : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Overview
                        </button>
                        {features.map((feature) => (
                            <button
                                key={feature.id}
                                onClick={() => setActiveView(feature.id)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    activeView === feature.id
                                        ? isDark 
                                            ? 'bg-gray-800 text-green-400 shadow-sm' 
                                            : 'bg-white text-green-600 shadow-sm'
                                        : isDark
                                            ? 'text-gray-300 hover:text-gray-100'
                                            : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {feature.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : activeView === 'overview' ? (
                    <>
                        {renderOverview()}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => analyticsAPI.export.overview()}
                                className={`px-4 py-2 rounded-md text-sm font-medium shadow transition-colors ${
                                    isDark
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                            >
                                Export Overview CSV
                            </button>
                        </div>
                    </>
                ) : (
                    renderFeatureAnalytics()
                )}

                {/* Feature Grid for Overview */}
                {activeView === 'overview' && !isLoading && (
                    <div className="mt-12">
                        <h2 className={`text-xl font-semibold mb-6 pl-1 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Feature Analytics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-3 gap-8">
                            {features.map((feature) => (
                                <FeatureCard
                                    key={feature.id}
                                    {...feature}
                                    onClick={() => setActiveView(feature.id)}
                                    isActive={activeView === feature.id}
                                    isDark={isDark}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Analytics;
