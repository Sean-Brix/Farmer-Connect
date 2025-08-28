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
        label: 'Seminars',
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
        key: 'chat',
        label: 'Inquiries',
        icon: <i className="fas fa-comments h-5 w-5 sidebar-icon"></i>,
    },
    {
        key: 'seed',
        label: 'Seed Growth Tracking',
        icon: <i className="fas fa-seedling h-5 w-5 sidebar-icon"></i>,
    },
    {
        key: 'survey',
        label: 'Survey Forms',
        icon: <i className="fas fa-poll h-5 w-5 sidebar-icon"></i>,
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
    theme,
    isDark,
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
        <>
            {/* Import Poppins font from Google Fonts */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');`}</style>
            <aside
                className={`sidebar transition-all duration-300 w-64 backdrop-blur-xl border-r shadow-2xl hidden md:flex flex-col fixed left-0 top-0 z-30 h-screen max-h-screen ${iconOnlyClass} ${
                    isDark 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-green-200'
                }`}
                style={{ boxShadow: '0 8px 32px 0 rgba(30,41,59,0.13), 0 1.5px 0 0 #2563eb22', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
            >
                <div className="flex flex-col h-full max-h-screen">
                    <div className={`p-6 border-b flex items-center shadow-sm ${
                        isDark 
                            ? 'border-gray-700 bg-gray-800' 
                            : 'border-green-200 bg-white'
                    }`}>
                        <h1 className={`text-2xl font-extrabold tracking-tight sidebar-label drop-shadow-sm ${
                            isDark ? 'text-green-400' : 'text-green-800'
                        }`} style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>FITS - TANZA</h1>
                    </div>
                    <nav className="mt-3 flex-1 overflow-y-auto minimalist-scrollbar">
                        <ul className="space-y-2 px-3">
                            {filteredMenuItems.map((item) => (
                                <li
                                    key={item.key}
                                    className={`flex items-center gap-4 px-5 py-3 text-lg rounded-xl transition cursor-pointer sidebar-item shadow-sm
                                        ${
                                            currentPageKey === item.key
                                                ? isDark 
                                                    ? 'bg-gradient-to-r from-green-900/50 to-green-800/50 text-green-300 ring-2 ring-green-500/30 shadow-lg'
                                                    : 'bg-gradient-to-r from-green-200/80 to-green-100/80 text-green-800 ring-2 ring-green-400/30 shadow-lg'
                                                : isDark
                                                    ? 'text-gray-300 hover:bg-green-900/30 hover:shadow-md'
                                                    : 'text-gray-700 hover:bg-green-100/70 hover:shadow-md'
                                        }
                                    `}
                                    style={{ minHeight: '3.2rem', letterSpacing: '0.01em', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                                    onClick={() => handleClick(item)}
                                >
                                    <span className={`sidebar-icon text-xl drop-shadow-sm ${
                                        currentPageKey === item.key 
                                            ? isDark ? 'text-green-400' : 'text-green-700/90'
                                            : isDark ? 'text-green-500' : 'text-green-700/90'
                                    }`}>{item.icon}</span>
                                    <span className="sidebar-label font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className={`p-6 border-t flex flex-col items-center mt-auto shadow-inner ${
                        isDark 
                            ? 'border-gray-700 bg-gray-800' 
                            : 'border-green-200 bg-white'
                    }`}>
                        <div
                            className={`flex items-center mb-5 w-full gap-4 cursor-pointer rounded-xl p-3 transition shadow-sm ${
                                isDark 
                                    ? 'hover:bg-green-900/30' 
                                    : 'hover:bg-green-100/60'
                            }`}
                            onClick={() => navigate('/settings/profile')}
                            style={{ minHeight: '4.2rem' }}
                        >
                            <img
                                src={details.picture}
                                alt="Profile"
                                className={`h-12 w-12 rounded-full object-cover border-2 shadow ${
                                    isDark ? 'border-green-500' : 'border-green-300'
                                }`}
                                style={{ background: '#e0e7ef' }}
                            />
                            <div className="flex flex-col sidebar-profile-info">
                                <span className={`font-bold sidebar-username text-base tracking-tight drop-shadow-sm ${
                                    isDark ? 'text-green-300' : 'text-green-900'
                                }`} style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>
                                    {details.username}
                                </span>
                                <span className={`text-sm sidebar-position font-medium ${
                                    isDark ? 'text-green-400' : 'text-green-500'
                                }`} style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>
                                    {details.position}
                                </span>
                            </div>
                        </div>
                        <button
                            className={`flex items-center justify-center gap-3 px-6 py-3 rounded-xl transition w-full border font-bold text-base shadow-md hover:shadow-lg sidebar-logout-btn ${
                                isDark 
                                    ? 'bg-gray-700 hover:bg-red-900 border-gray-600 text-red-400 hover:text-red-300' 
                                    : 'bg-white hover:bg-red-50 border-red-200 text-red-700 hover:text-red-800'
                            }`}
                            onClick={logging}
                            style={{ letterSpacing: '0.01em', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
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
                    /* Use Poppins font for sidebar */
                    .sidebar, .sidebar-label, .sidebar-username, .sidebar-position, .sidebar-logout-text {
                        font-family: 'Poppins', Inter, 'Segoe UI', Arial, sans-serif !important;
                    }
            /* Use Poppins font for sidebar */
            .sidebar, .sidebar-label, .sidebar-username, .sidebar-position, .sidebar-logout-text {
                font-family: 'Poppins', Inter, 'Segoe UI', Arial, sans-serif !important;
            }
                .minimalist-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    background: transparent;
                }
                .minimalist-scrollbar::-webkit-scrollbar-thumb {
                    background: #22c55e !important; /* green-500 */
                    border-radius: 4px !important;
                }
                .minimalist-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #16a34a !important; /* green-600 */
                }
                .minimalist-scrollbar {
                    scrollbar-width: thin !important;
                    scrollbar-color: #22c55e transparent !important; /* green-500 */
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
                .sidebar-icon {
                    width: 1.7rem !important;
                    height: 1.7rem !important;
                    min-width: 1.7rem !important;
                    min-height: 1.7rem !important;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .sidebar-icon svg {
                    width: 100% !important;
                    height: 100% !important;
                }
                .sidebar-item {
                    box-shadow: 0 1px 4px 0 rgba(30,41,59,0.04);
                }
                .sidebar-item:active {
                    transform: scale(0.98);
                }
                .sidebar-logout-btn:active {
                    transform: scale(0.97);
                }
                    
            `}</style>
            </aside>
        </>
    );
}
