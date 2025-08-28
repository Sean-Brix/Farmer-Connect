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
    const [timeRange, setTimeRange] = useState('7d');
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

    // Mock data for development
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setIsLoading(true);
            try {
                // Simulate API calls - replace with actual endpoints later
                const endpoints = [
                    '/api/analytics/overview',
                    '/api/analytics/users',
                    '/api/analytics/seminars',
                    '/api/analytics/eic',
                    '/api/analytics/distribution',
                    '/api/analytics/inventory',
                ];

                // Mock data for now
                setTimeout(() => {
                    setOverviewData({
                        totalUsers: 1234,
                        totalSeminars: 45,
                        totalEIC: 2456,
                        totalDistributions: 699,
                        totalInventoryItems: 1892,
                        userGrowth: 15.5,
                        seminarGrowth: 8.2,
                        eicGrowth: -2.3,
                        distributionGrowth: 12.8,
                        inventoryGrowth: 5.1,
                    });

                    setUsersData({
                        monthlyRegistrations: [
                            120, 135, 145, 160, 180, 195, 210,
                        ],
                        activeUsers: 856,
                        userTypes: { farmers: 890, admins: 12, staff: 332 },
                        topRegions: ['Region 1', 'Region 2', 'Region 3'],
                    });

                    setSeminarsData({
                        monthlyCompletions: [5, 8, 12, 15, 18, 20, 22],
                        averageRating: 4.8,
                        categories: {
                            farming: 25,
                            technology: 12,
                            business: 8,
                        },
                        attendance: 87,
                    });

                    setEicData({
                        monthlyDistribution: [
                            150, 180, 200, 220, 250, 280, 300,
                        ],
                        categories: { seeds: 45, tools: 30, fertilizer: 25 },
                        utilization: 67,
                        topItems: ['Pechay Seeds', 'Mangrove Seeds', 'Shovel'],
                    });

                    setDistributionData({
                        monthlyRequests: [80, 95, 110, 125, 140, 155, 170],
                        fulfillmentRate: 92,
                        averageTime: 2.3,
                        regions: { region1: 45, region2: 35, region3: 20 },
                    });

                    setInventoryData({
                        stockLevels: [1800, 1850, 1900, 1950, 2000, 1950, 1892],
                        categories: { seeds: 40, tools: 35, fertilizer: 25 },
                        turnover: 3.2,
                        lowStock: 234,
                    });

                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
                setIsLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [timeRange]);

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
                />
            </div>

            {/* Overview Chart */}
            <ChartContainer
                title="Platform Growth Overview"
                className="col-span-full"
            >
                <div className="h-80">
                    <canvas ref={overviewChartRef} />
                </div>
            </ChartContainer>
        </div>
    );

    const renderFeatureAnalytics = () => {
        const currentFeature = features.find((f) => f.id === activeView);

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center mb-6">
                        <div
                            className={`p-4 rounded-lg bg-gradient-to-r ${currentFeature.color} mr-4`}
                        >
                            <div className="w-8 h-8 text-white">
                                {currentFeature.icon}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {currentFeature.title}
                            </h2>
                            <p className="text-gray-600">
                                {currentFeature.description}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {currentFeature.stats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="text-center p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <ChartContainer
                    title={`${currentFeature.title} Detailed Analytics`}
                    className="col-span-full"
                >
                    <div className="h-80">
                        <canvas ref={featureChartRef} />
                    </div>
                </ChartContainer>
            </div>
        );
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
                        data: seminarsData.monthlyCompletions || [],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true,
                    },
                    {
                        label: 'Distributions',
                        data: distributionData.monthlyRequests || [],
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
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                        },
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                        },
                    },
                },
            });
        }
    }, [activeView, isLoading, usersData, seminarsData, distributionData]);

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
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        }`}>
            <div className={`w-full max-w-4xl xl:max-w-6xl 2xl:max-w-6xl mx-auto rounded-2xl shadow-xl p-8 md:p-12 lg:p-14 border ${
                isDark 
                    ? 'bg-gray-800/80 border-gray-600' 
                    : 'bg-white/80 border-gray-200'
            }`}>
                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                        <div>
                            <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-1 ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                Analytics Dashboard
                            </h1>
                            <p className={`text-base md:text-lg ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Comprehensive insights into your Farmer Connect platform
                            </p>
                        </div>
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
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-wrap gap-1 bg-gray-100 p-2 rounded-lg shadow-sm">
                        <button
                            onClick={() => setActiveView('overview')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                activeView === 'overview'
                                    ? 'bg-white text-green-600 shadow-sm'
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
                                        ? 'bg-white text-green-600 shadow-sm'
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
                    renderOverview()
                ) : (
                    renderFeatureAnalytics()
                )}

                {/* Feature Grid for Overview */}
                {activeView === 'overview' && !isLoading && (
                    <div className="mt-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 pl-1">
                            Feature Analytics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature) => (
                                <FeatureCard
                                    key={feature.id}
                                    {...feature}
                                    onClick={() => setActiveView(feature.id)}
                                    isActive={activeView === feature.id}
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
