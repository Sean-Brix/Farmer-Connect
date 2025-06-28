import React from 'react';
import { useNavigate } from 'react-router-dom';

const menuItems = [
    {
        key: 'home',
        label: 'Home',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sidebar-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.707 2.293a1 1 0 0 1 1.414 0l8 8A1 1 0 0 1 19.707 11H19v8a2 2 0 0 1-2 2h-2a1 1 0 0 1-1-1v-4h-2v4a1 1 0 0 1-1 1h-2a2 2 0 0 1-2-2v-8h-.707a1 1 0 0 1-.707-1.707l8-8z"/>
            </svg>
        ),
        to: '/',
    },
    {
        key: 'analytics',
        label: 'Analytics',
        icon: <i className="fas fa-chart-line h-5 w-5 sidebar-icon"></i>,
    },
    {
        key: 'profiles',
        label: 'User Profiles',
        icon: <i className="fas fa-user-circle h-5 w-5 sidebar-icon"></i>,
    },
    {
        key: 'enrollment',
        label: 'Seminar Programs',
        icon: <i className="fas fa-user-plus h-5 w-5 sidebar-icon"></i>,
    },
    {
        key: 'eic',
        label: 'EIC - Item Panel',
        icon: <i className="fas fa-id-card h-5 w-5 sidebar-icon"></i>,
    },
    {
        key: 'distribution',
        label: 'Distributions',
        icon: <i className="fas fa-box-open h-5 w-5 sidebar-icon"></i>,
    },
    {
        key: 'content',
        label: 'Inventory',
        icon: <i className="fas fa-archive h-5 w-5 sidebar-icon"></i>,
    },
    {
        key: 'audit',
        label: 'Logs / Audit Trail',
        icon: <i className="fas fa-clipboard-list h-5 w-5 sidebar-icon"></i>,
    },
    {
        key: 'survey',
        label: 'Survey Forms',
        icon: <i className="fas fa-poll h-5 w-5 sidebar-icon"></i>,
    },
    {
        key: 'settings',
        label: 'Settings',
        icon: <i className="fas fa-cog h-5 w-5 sidebar-icon"></i>,
    },
];

export default function Sidebar({
    setPage,
    details = {},
    logging,
    elements,
    iconOnlyClass = '',
    currentPageKey,
    handleSetPage,
}) {
    const navigate = useNavigate();

    const handleClick = (item) => {
        if (item.to) {
            window.location.href = item.to;
        } else if (handleSetPage) {
            handleSetPage(item.key);
        } else if (setPage && elements?.current?.[item.key]) {
            setPage(elements.current[item.key]);
        }
    };

    // Remove the Home icon from menuItems
    const filteredMenuItems = menuItems.filter(item => item.key !== 'home');

    return (
        <aside
            className={`sidebar transition-all duration-200 w-64 bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-lg hidden md:flex flex-col fixed left-0 top-0 z-30 h-screen max-h-screen ${iconOnlyClass}`}
        >
            <div className="flex flex-col h-full max-h-screen">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800 sidebar-label">Dashboard</h1>
                </div>
                <nav className="mt-2 flex-1 overflow-y-auto minimalist-scrollbar">
                    <ul className="space-y-1 px-2">
                        {filteredMenuItems.map((item) => (
                            <li
                                key={item.key}
                                className={`flex items-center gap-4 p-4 text-lg rounded-lg transition cursor-pointer sidebar-item
                                    ${
                                        currentPageKey === item.key
                                            ? 'bg-gray-200 font-semibold text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }
                                `}
                                onClick={() => handleClick(item)}
                            >
                                <span className="sidebar-icon">{item.icon}</span>
                                <span className="sidebar-label">{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-200 flex flex-col items-center mt-auto bg-white/80">
                    <div
                        className="flex items-center mb-4 w-full gap-4 cursor-pointer hover:bg-gray-100 rounded-lg p-3 transition"
                        onClick={() => setPage(elements.current['account'])}
                    >
                        <div className="relative rounded-full border-2 border-blue-100 shadow-sm">
                            <img
                                src={details.picture}
                                alt="Profile"
                                className="h-12 w-12 rounded-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 sidebar-username text-base">{details.username}</span>
                            <span className="text-sm text-gray-500 sidebar-position">{details.position}</span>
                        </div>
                    </div>
                    <button
                        className="flex items-center justify-center gap-3 px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700 w-full border border-gray-200 font-semibold text-base"
                        onClick={logging}
                    >
                        <span>
                            <i className="fas fa-sign-out-alt h-5 w-5"></i>
                        </span>
                        <span className="sidebar-logout-text">Logout</span>
                    </button>
                </div>
            </div>
            {/* Minimalist scrollbar and icon-only mode styles */}
            <style>{`
                .minimalist-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    background: transparent;
                }
                .minimalist-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 4px;
                }
                .minimalist-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #e5e7eb transparent;
                }
                @media (max-width: 1300px) and (min-width: 1000px) {
                    .sidebar-icon-only {
                        width: 4.5rem !important;
                        min-width: 4.5rem !important;
                        max-width: 4.5rem !important;
                    }
                    .sidebar-icon-only .sidebar-label,
                    .sidebar-icon-only .sidebar-username,
                    .sidebar-icon-only .sidebar-position,
                    .sidebar-icon-only .sidebar-logout-text {
                        display: none !important;
                    }
                    .sidebar-icon-only .sidebar-icon {
                        justify-content: center !important;
                    }
                }
                /* Ensure all sidebar icons are the same size */
                .sidebar-icon {
                    width: 1.5rem !important;
                    height: 1.5rem !important;
                    min-width: 1.5rem !important;
                    min-height: 1.5rem !important;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                /* Remove icon size from Home SVG itself, handled by sidebar-icon */
                .sidebar-icon svg {
                    width: 100% !important;
                    height: 100% !important;
                }
            `}</style>
        </aside>
    );
}
