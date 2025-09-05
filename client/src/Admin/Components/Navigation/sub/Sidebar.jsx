import React from 'react';
import { useNavigate } from 'react-router-dom';
import { menuItems } from './menuItems.jsx';

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
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>
            {/* Import Font Awesome for icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
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
                        <ul className="space-y-2 px-4 py-4">
                            {filteredMenuItems.map((item) => (
                                <li
                                    key={item.key}
                                    className={`flex items-center gap-4 px-6 py-4 text-lg rounded-xl transition cursor-pointer shadow-sm
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
                                    style={{ minHeight: '3.5rem', letterSpacing: '0.01em', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                                    onClick={() => handleClick(item)}
                                >
                                    <div className={`sidebar-icon flex items-center justify-center drop-shadow-sm ${
                                        currentPageKey === item.key 
                                            ? isDark ? 'text-green-400' : 'text-green-700'
                                            : isDark ? 'text-green-500' : 'text-green-600'
                                    }`} style={{ fontSize: '1.25rem', width: '1.25rem', height: '1.25rem', minWidth: '1.25rem', minHeight: '1.25rem' }}>
                                        {item.icon}
                                    </div>
                                    <span className="sidebar-label font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', fontWeight: '500' }}>{item.label}</span>
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
                                }`} style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', fontWeight: '600' }}>
                                    {details.username}
                                </span>
                                <span className={`text-sm sidebar-position font-medium ${
                                    isDark ? 'text-green-400' : 'text-green-500'
                                }`} style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', fontWeight: '500' }}>
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
                            <span className="sidebar-logout-text" style={{ fontWeight: '600' }}>Logout</span>
                        </button>
                    </div>
                </div>
                {/* Minimalist scrollbar and icon-only mode styles */}
                <style>{`
                    /* Use Poppins font for sidebar with specific font weights */
                    .sidebar, .sidebar * {
                        font-family: 'Poppins', Inter, 'Segoe UI', Arial, sans-serif !important;
                    }
                    
                    /* Override all font-weight inheritance for sidebar labels */
                    .sidebar-label {
                        font-family: 'Poppins', Inter, 'Segoe UI', Arial, sans-serif !important;
                        font-weight: 500 !important;
                    }
                    
                    /* Ensure navigation links don't inherit bold font weight */
                    .sidebar-item .sidebar-label {
                        font-weight: 500 !important;
                    }
                    
                    /* Profile info specific font weights */
                    .sidebar-username {
                        font-family: 'Poppins', Inter, 'Segoe UI', Arial, sans-serif !important;
                        font-weight: 600 !important;
                    }
                    
                    .sidebar-position {
                        font-family: 'Poppins', Inter, 'Segoe UI', Arial, sans-serif !important;
                        font-weight: 500 !important;
                    }
                    
                    .sidebar-logout-text {
                        font-family: 'Poppins', Inter, 'Segoe UI', Arial, sans-serif !important;
                        font-weight: 600 !important;
                    }
                    
                    /* Header title font weight */
                    .sidebar h1 {
                        font-family: 'Poppins', Inter, 'Segoe UI', Arial, sans-serif !important;
                        font-weight: 700 !important;
                    }
                    
                    /* Sidebar icon styling to match mobile */
                    .sidebar-icon {
                        width: 1.25rem !important;
                        height: 1.25rem !important;
                        min-width: 1.25rem !important;
                        min-height: 1.25rem !important;
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        font-size: 1.25rem !important;
                    }
                    .sidebar-icon svg {
                        width: 1.25rem !important;
                        height: 1.25rem !important;
                        display: block !important;
                    }
                    .sidebar-icon i {
                        width: 1.25rem !important;
                        height: 1.25rem !important;
                        font-size: 1.25rem !important;
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        line-height: 1 !important;
                    }
                    /* Ensure Font Awesome icons are visible */
                    .sidebar-icon .fas,
                    .sidebar-icon .fab,
                    .sidebar-icon .far,
                    .sidebar-icon .fal {
                        font-family: "Font Awesome 6 Free" !important;
                        font-weight: 900 !important;
                        display: inline-block !important;
                        font-style: normal !important;
                        font-variant: normal !important;
                        text-rendering: auto !important;
                        line-height: 1 !important;
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
