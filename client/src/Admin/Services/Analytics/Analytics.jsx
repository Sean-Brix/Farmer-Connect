import React, { useState, useEffect, useRef } from 'react';
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
    Filler
);

function Analytics() {
    const [userStats, setUserStats] = useState([]);
    const [seminarStats, setSeminarStats] = useState([]);
    const [eicStats, setEicStats] = useState([]);
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalSeminars, setTotalSeminars] = useState(0);
    const [availableEIC, setAvailableEIC] = useState(0);
    const [waitingDistributionRequests, setWaitingDistributionRequests] =
        useState(0);
    const [topClientProfile, setTopClientProfile] = useState('');
    const [clientProfileCounts, setClientProfileCounts] = useState({});
    const [topEICCategory, setTopEICCategory] = useState('');
    const [eicCategoryCounts, setEICCategoryCounts] = useState({});
    const [analyticsData, setAnalyticsData] = useState({});

    const userChartRef = useRef(null);
    const seminarChartRef = useRef(null);
    const eicChartRef = useRef(null);
    const monthlyUserGrowthChartRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await fetch('/api/accounts/getCount');
                let usercount = await userRes.json();
                const semRes = await fetch('/api/seminars/getCount');
                let semcount = await semRes.json();
                const eicRes = await fetch('/api/eic/getCount');
                let eiccount = await eicRes.json();
                const waitRes = await fetch(
                    '/api/distribution/getWaitingCount'
                );
                let waitcount = await waitRes.json();
                const data = {
                    payload: {
                        total_users: usercount.payload,
                        total_seminars: semcount.payload,
                        available_eic: eiccount.payload,
                        waiting_distributions: waitcount.payload,
                        top_client_profile: 'Pechay Seeds',
                        client_profile_counts: {
                            'Pechay Seeds': 450,
                            'Mangroove Seeds': 300,
                            Shovel: 250,
                            'Fertilizer ': 250,
                        },
                        top_eic_category: 'Category A',
                        eic_category_counts: {
                            'Category A': 6000,
                            'Category B': 3000,
                            'Category C': 2200,
                        },
                    },
                };

                setAnalyticsData(data.payload);
                setTotalUsers(data.payload.total_users);
                setTotalSeminars(data.payload.total_seminars);
                setAvailableEIC(data.payload.available_eic);
                setWaitingDistributionRequests(
                    data.payload.waiting_distributions
                );
                setTopClientProfile(data.payload.top_client_profile || 'N/A');
                setClientProfileCounts(data.payload.client_profile_counts);
                setTopEICCategory(data.payload.top_eic_category || 'N/A');
                setEICCategoryCounts(data.payload.eic_category_counts);

                const userStatsData = [
                    data.payload.total_users - 10,
                    data.payload.total_users - 12,
                    data.payload.total_users - 8,
                    data.payload.total_users - 7,
                    data.payload.total_users - 3,
                    data.payload.total_users - 6,
                    data.payload.total_users - 7,
                    data.payload.total_users - 5,
                    data.payload.total_users - 4,
                    data.payload.total_users - 6,
                    data.payload.total_users - 5,
                    data.payload.total_users,
                ];
                const seminarStatsData = [
                    data.payload.total_seminars - 10,
                    data.payload.total_seminars - 12,
                    data.payload.total_seminars - 8,
                    data.payload.total_seminars - 7,
                    data.payload.total_seminars - 3,
                    data.payload.total_seminars - 5,
                    data.payload.total_seminars - 5,
                    data.payload.total_seminars - 5,
                    data.payload.total_seminars - 5,
                    data.payload.total_seminars - 5,
                    data.payload.total_seminars - 5,
                    data.payload.total_seminars,
                ];
                const eicStatsData = [
                    data.payload.available_eic - 6,
                    data.payload.available_eic - 80,
                    data.payload.available_eic - 60,
                    data.payload.available_eic - 50,
                    data.payload.available_eic - 40,
                    data.payload.available_eic - 30,
                    data.payload.available_eic - 20,
                    data.payload.available_eic - 15,
                    data.payload.available_eic - 10,
                    data.payload.available_eic - 5,
                    data.payload.available_eic - 2,
                    data.payload.available_eic,
                ];

                setUserStats(userStatsData);
                setSeminarStats(seminarStatsData);
                setEicStats(eicStatsData);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (userChartRef.current) {
            const ctx = userChartRef.current.getContext('2d');
            if (window.myLine) {
                window.myLine.destroy();
            }
            window.myLine = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Total Users',
                            data: userStats,
                            fill: false,
                            borderColor: '#3b82f6',
                            tension: 0.1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });
        }
        if (seminarChartRef.current) {
            const ctx = seminarChartRef.current.getContext('2d');
            if (window.myArea) {
                window.myArea.destroy();
            }
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

            window.myArea = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Total Seminars',
                            data: seminarStats,
                            fill: true,
                            backgroundColor: gradient,
                            borderColor: '#3b82f6',
                            tension: 0.1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });
        }

        if (eicChartRef.current) {
            const ctx = eicChartRef.current.getContext('2d');
            if (window.myDoughnut) {
                window.myDoughnut.destroy();
            }
            window.myDoughnut = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Available EIC', 'Remaining'],
                    datasets: [
                        {
                            label: 'EIC Distribution',
                            data: [
                                availableEIC,
                                analyticsData.available_eic * 2 - availableEIC,
                            ],
                            backgroundColor: ['#3b82f6', '#e5e7eb'],
                            borderWidth: 0,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: false,
                            position: 'bottom',
                        },
                    },
                },
            });
        }

        if (monthlyUserGrowthChartRef.current) {
            const ctx = monthlyUserGrowthChartRef.current.getContext('2d');
            if (window.myBar) {
                window.myBar.destroy();
            }
            window.myBar = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Monthly User Growth',
                            data: userStats,
                            backgroundColor: '#2563eb',
                            borderWidth: 0,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });
        }
    }, [userStats, seminarStats, eicStats, availableEIC, analyticsData]);

    return (
        <div className="w-full mx-auto px-2 sm:mt-10 sm:px-4 py-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
            <div className="mb-10">
                <div className="flex items-center w-full">
                    <hr className="flex-grow border-t border-gray-200" />
                    <h1 className="mx-3 text-2xl sm:text-3xl font-bold text-gray-800 bg-white/80 px-6 py-1 rounded-full shadow whitespace-nowrap tracking-tight">
                        Analytics Dashboard
                    </h1>
                    <hr className="flex-grow border-t border-gray-200" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center hover:shadow-lg transition">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100">
                            {/* Users icon: User Group */}
                            <svg
                                className="w-5 h-5 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                            Total Users
                        </span>
                    </div>
                    <span className="text-2xl font-semibold text-gray-800 mb-1">
                        {totalUsers}
                    </span>
                    <span className="text-xs text-gray-400 font-medium mb-2">
                        +
                        {userStats.length > 1
                            ? userStats[userStats.length - 1] -
                              userStats[userStats.length - 2]
                            : 0}{' '}
                        this month
                    </span>
                    <div className="w-full h-20">
                        <canvas ref={userChartRef} />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center hover:shadow-lg transition">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100">
                            {/* Seminar icon: Presentation Chart Bar */}
                            <svg
                                className="w-5 h-5 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6h18M9 16v-4m3 4v-2m3 2v-6" />
                            </svg>
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                            Total Seminars
                        </span>
                    </div>
                    <span className="text-2xl font-semibold text-gray-800 mb-1">
                        {totalSeminars}
                    </span>
                    <span className="text-xs text-gray-400 font-medium mb-2">
                        +
                        {seminarStats.length > 1
                            ? seminarStats[seminarStats.length - 1] -
                              seminarStats[seminarStats.length - 2]
                            : 0}{' '}
                        this month
                    </span>
                    <div className="w-full h-20">
                        <canvas ref={seminarChartRef} />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center hover:shadow-lg transition">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100">
                            {/* EIC icon: Currency Dollar */}
                            <svg
                                className="w-5 h-5 text-yellow-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                            </svg>
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                            Available EIC
                        </span>
                    </div>
                    <span className="text-2xl font-semibold text-gray-800 mb-1">
                        {availableEIC}
                    </span>
                    <span className="text-xs text-gray-400 font-medium mb-2">
                        +
                        {eicStats.length > 1
                            ? eicStats[eicStats.length - 1] -
                              eicStats[eicStats.length - 2]
                            : 0}{' '}
                        this month
                    </span>
                    <div className="w-full h-20">
                        <canvas ref={eicChartRef} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
                    <h2 className="text-base font-semibold text-gray-700 mb-3 text-center tracking-wide">
                        Monthly User Growth
                    </h2>
                    <div className="w-full">
                        <canvas ref={monthlyUserGrowthChartRef} />
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-gray-400 font-medium">
                        {months.map((m, i) => (
                            <span key={i} className="text-center w-1/12">
                                {m}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
                    <h2 className="text-base font-semibold text-gray-700 mb-3 text-center tracking-wide">
                        Key Metrics
                    </h2>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-gray-50 rounded-lg shadow-sm p-4 flex flex-col items-center">
                            <span className="text-gray-600 font-medium text-xs">
                                Waiting Distribution Requests
                            </span>
                            <span className="text-lg font-bold text-gray-800 mt-1">
                                {waitingDistributionRequests}
                            </span>
                        </div>
                        <div className="bg-gray-50 rounded-lg shadow-sm p-4 flex flex-col items-center">
                            <span className="text-gray-600 font-medium text-xs">
                                Top Client Profile
                            </span>
                            <span className="text-lg font-bold text-gray-800 mt-1">
                                {topClientProfile}
                            </span>
                        </div>
                        <div className="bg-gray-50 rounded-lg shadow-sm p-4 flex flex-col items-center col-span-2">
                            <span className="text-gray-600 font-medium text-xs">
                                Top EIC Category
                            </span>
                            <span className="text-lg font-bold text-gray-800 mt-1">
                                {topEICCategory}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-5">
                    <h2 className="text-base font-semibold text-gray-700 mb-3 text-center">
                        Client Profile Distribution
                    </h2>
                    <ul className="divide-y divide-gray-100">
                        {Object.entries(clientProfileCounts)
                            .sort(([, a], [, b]) => b - a)
                            .map(([profile, count], idx) => (
                                <li
                                    key={idx}
                                    className="flex justify-between py-2 px-1"
                                >
                                    <span className="font-medium text-gray-700">
                                        {profile}
                                    </span>
                                    <span className="text-gray-500">
                                        <span className="font-semibold">
                                            {count}
                                        </span>
                                    </span>
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">
                    <h2 className="text-base font-semibold text-gray-700 mb-3 text-center">
                        User Growth Rate
                    </h2>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-extrabold text-gray-700">
                            {userStats.length > 1
                                ? (
                                      ((userStats[userStats.length - 1] -
                                          userStats[0]) /
                                          userStats[0]) *
                                      100
                                  ).toFixed(1)
                                : 0}
                            %
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                            Since {months[0]}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
