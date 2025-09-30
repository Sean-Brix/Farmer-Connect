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
         mobile, // Added mobile prop
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
                            {/* Split menu items into before and after 'Services' */}
                            {(() => {
                                const beforeServices = filteredMenuItems.filter(item => !['distribution','enrollment','eic','seed','content'].includes(item.key) && !['settings','profile','logout'].includes(item.key));
                                const services = filteredMenuItems.filter(item => ['distribution','enrollment','eic','seed','content'].includes(item.key));
                                return (
                                    <>
                                        {/* Menu separator above Analytics */}
                                        <li style={{ padding: 0, textAlign: 'left', width: '100%'}}>
                                            <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                                <span style={{display: 'inline-block', height: 1, width: 10, borderBottom: isDark ? '1.5px solid #6b7280' : '1.5px solid #d1d5db', opacity: 0.7, marginRight: 18}}></span>
                                                <span style={{
                                                    fontSize: '0.95rem',
                                                    fontWeight: 700,
                                                    color: isDark ? '#6ee7b7' : '#047857',
                                                    letterSpacing: '0.08em',
                                                    textTransform: 'uppercase',
                                                    opacity: 0.85,
                                                    padding: '0 0.5rem 0 0',
                                                    whiteSpace: 'nowrap',
                                                    minWidth: '70px',
                                                    marginBottom: '0.05rem'
                                                }}>Menu</span>
                                                <span style={{display: 'inline-block', height: 1, width: '100%', maxWidth: 100, borderBottom: isDark ? '1.5px solid #6b7280' : '1.5px solid #d1d5db', opacity: 0.7, marginLeft: 8}}></span>
                                            </div>
                                        </li>
                                        {beforeServices.map((item, idx) => (
                                            <React.Fragment key={item.key}>
                                                <li
                                                    className={`flex items-center gap-5 px-7 py-3 text-lg transition cursor-pointer group
                                                        ${
                                                            currentPageKey === item.key
                                                                ? isDark 
                                                                    ? 'active-sidebar-link-dark'
                                                                    : 'active-sidebar-link-light'
                                                                : isDark
                                                                    ? 'text-gray-300 hover:bg-green-900/20'
                                                                    : 'text-gray-700 hover:bg-green-50/80'
                                                        }
                                                    `}
                                                    style={{
                                                        minHeight: '3.2rem',
                                                        letterSpacing: '0.01em',
                                                        fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif',
                                                        borderRadius: '0.7rem',
                                                        margin: '0.35rem 0',
                                                        border: currentPageKey === item.key ? (isDark ? '1.5px solid #34d399' : '1.5px solid #22c55e') : 'none',
                                                        boxShadow: currentPageKey === item.key ? (isDark ? '0 4px 16px 0 rgba(16,185,129,0.13)' : '0 4px 16px 0 rgba(34,197,94,0.10)') : 'none',
                                                        fontWeight: currentPageKey === item.key ? 700 : 500,
                                                        color: currentPageKey === item.key ? (isDark ? '#bbf7d0' : '#166534') : undefined,
                                                        textShadow: currentPageKey === item.key ? (isDark ? '0 1px 2px #14532d44' : '0 1px 2px #bbf7d044') : 'none',
                                                        backdropFilter: currentPageKey === item.key ? 'blur(6px)' : undefined,
                                                        background: currentPageKey === item.key
                                                            ? (isDark
                                                                ? 'linear-gradient(90deg, rgba(16,185,129,0.18) 0%, rgba(34,197,94,0.13) 100%)'
                                                                : 'linear-gradient(90deg, rgba(34,197,94,0.13) 0%, rgba(16,185,129,0.10) 100%)')
                                                            : undefined,
                                                        transition: 'background 0.2s, box-shadow 0.2s, border 0.2s',
                                                    }}
                                                    onClick={() => handleClick(item)}
                                                >
                                                    <div className={`sidebar-icon flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
                                                        currentPageKey === item.key 
                                                            ? isDark ? 'text-green-300' : 'text-green-700'
                                                            : isDark ? 'text-green-500' : 'text-green-600'
                                                    }`} style={{ fontSize: '1.3rem', width: '2.5rem', height: '2.5rem', minWidth: '2.5rem', minHeight: '2.5rem', background: 'transparent', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {item.icon}
                                                    </div>
                                                    <span className="sidebar-label font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', fontWeight: '500', fontSize: '1.13rem' }}>{item.label}</span>
                                                </li>
                                            </React.Fragment>
                                        ))}
                                        {/* Services separator */}
                                        <li style={{margin: '1.2rem 0 0.05rem 0', padding: 0, textAlign: 'left', width: '100%'}}>
                                            <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                                <span style={{display: 'inline-block', height: 1, width: 10, borderBottom: isDark ? '1.5px solid #6b7280' : '1.5px solid #d1d5db', opacity: 0.7, marginRight: 14}}></span>
                                                <span style={{
                                                    fontSize: '0.95rem',
                                                    fontWeight: 700,
                                                    color: isDark ? '#6ee7b7' : '#047857',
                                                    letterSpacing: '0.08em',
                                                    textTransform: 'uppercase',
                                                    opacity: 0.85,
                                                    padding: '0 0.5rem 0 0',
                                                    whiteSpace: 'nowrap',
                                                    minWidth: '70px',
                                                    marginBottom: '0.05rem'
                                                }}>Services</span>
                                                <span style={{display: 'inline-block', height: 1, width: '100%', maxWidth: 100, borderBottom: isDark ? '1.5px solid #6b7280' : '1.5px solid #d1d5db', opacity: 0.7, marginLeft: 8}}></span>
                                            </div>
                                        </li>
                                        {services.map((item, idx) => (
                                            <React.Fragment key={item.key}>
                                                <li
                                                    className={`flex items-center gap-5 px-7 py-3 text-lg transition cursor-pointer group
                                                        ${
                                                            currentPageKey === item.key
                                                                ? isDark 
                                                                    ? 'active-sidebar-link-dark'
                                                                    : 'active-sidebar-link-light'
                                                                : isDark
                                                                    ? 'text-gray-300 hover:bg-green-900/20'
                                                                    : 'text-gray-700 hover:bg-green-50/80'
                                                        }
                                                    `}
                                                    style={{
                                                        minHeight: '3.2rem',
                                                        letterSpacing: '0.01em',
                                                        fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif',
                                                        borderRadius: '0.7rem',
                                                        margin: '0.35rem 0',
                                                        border: currentPageKey === item.key ? (isDark ? '1.5px solid #34d399' : '1.5px solid #22c55e') : 'none',
                                                        boxShadow: currentPageKey === item.key ? (isDark ? '0 4px 16px 0 rgba(16,185,129,0.13)' : '0 4px 16px 0 rgba(34,197,94,0.10)') : 'none',
                                                        fontWeight: currentPageKey === item.key ? 700 : 500,
                                                        color: currentPageKey === item.key ? (isDark ? '#bbf7d0' : '#166534') : undefined,
                                                        textShadow: currentPageKey === item.key ? (isDark ? '0 1px 2px #14532d44' : '0 1px 2px #bbf7d044') : 'none',
                                                        backdropFilter: currentPageKey === item.key ? 'blur(6px)' : undefined,
                                                        background: currentPageKey === item.key
                                                            ? (isDark
                                                                ? 'linear-gradient(90deg, rgba(16,185,129,0.18) 0%, rgba(34,197,94,0.13) 100%)'
                                                                : 'linear-gradient(90deg, rgba(34,197,94,0.13) 0%, rgba(16,185,129,0.10) 100%)')
                                                            : undefined,
                                                        transition: 'background 0.2s, box-shadow 0.2s, border 0.2s',
                                                    }}
                                                    onClick={() => handleClick(item)}
                                                >
                                                    <div className={`sidebar-icon flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
                                                        currentPageKey === item.key 
                                                            ? isDark ? 'text-green-300' : 'text-green-700'
                                                            : isDark ? 'text-green-500' : 'text-green-600'
                                                    }`} style={{ fontSize: '1.3rem', width: '2.5rem', height: '2.5rem', minWidth: '2.5rem', minHeight: '2.5rem', background: 'transparent', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {item.icon}
                                                    </div>
                                                    <span className="sidebar-label font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', fontWeight: '500', fontSize: '1.13rem' }}>{item.label}</span>
                                                </li>
                                            </React.Fragment>
                                        ))}
                                    </>
                                );
                            })()}
                        </ul>
                    </nav>
                    {/* Removed profile icon, settings, and logout button from sidebar */}
                </div>
                {/* Minimalist scrollbar and icon-only mode styles */}
                <style>{`
                .active-sidebar-link-dark {
                    background: linear-gradient(90deg, rgba(16,185,129,0.18) 0%, rgba(34,197,94,0.13) 100%) !important;
                    border: 1.5px solid #34d399 !important;
                    color: #bbf7d0 !important;
                    box-shadow: 0 4px 16px 0 rgba(16,185,129,0.13) !important;
                    font-weight: 700 !important;
                    text-shadow: 0 1px 2px #14532d44 !important;
                    backdrop-filter: blur(6px) !important;
                    transition: background 0.2s, box-shadow 0.2s, border 0.2s !important;
                }
                .active-sidebar-link-light {
                    background: linear-gradient(90deg, rgba(34,197,94,0.13) 0%, rgba(16,185,129,0.10) 100%) !important;
                    border: 1.5px solid #22c55e !important;
                    color: #166534 !important;
                    box-shadow: 0 4px 16px 0 rgba(34,197,94,0.10) !important;
                    font-weight: 700 !important;
                    text-shadow: 0 1px 2px #bbf7d044 !important;
                    backdrop-filter: blur(6px) !important;
                    transition: background 0.2s, box-shadow 0.2s, border 0.2s !important;
                }
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
