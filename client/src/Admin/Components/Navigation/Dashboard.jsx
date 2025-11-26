import { useEffect, useState, useRef } from 'react';
import logo from '../../../Assets/Logo.png';
import { useNavigate } from 'react-router-dom';
import default_picture from '../../../Assets/default_picture.png';
import { useTheme } from '../../../contexts/ThemeContext.jsx';

// SERVICES
import Analytics from '../../Services/Analytics/Analytics';
import Profiles from '../../Services/Profiles/Profiles.jsx';
import Seminar from '../../Services/Seminar/Seminar.jsx';
import EIC from '../../Services/EIC/EIC.jsx';
import Content from '../../Services/Inventory/Inventory.jsx';
import Distribution from '../../Services/Distribution/Distribution.jsx';
import Chat from '../../Services/Customer_Service/Chat_Module.jsx';
import Survey from '../../Services/Survey/Survey.jsx';
import PlantingReports from '../../Services/PlantingReport/PlantingReports.jsx';
import Settings from '../../Services/Settings/Settings.jsx';
import { PlantingReportProvider } from '../../../contexts/PlantingReportContext.jsx';

// GLOBAL
import AccountProfile from '../../../Components/settings/AccountProfile/AccountProfile.jsx';

// SUB COMPONENT
import Sidebar from './sub/Sidebar.jsx';
import Audit from '../../Services/Logs/Audit.jsx';
import { menuItems } from './sub/menuItems.jsx';

export default function Dashboard() {
    // Modern profile dropdown state
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const profileDropdownTimeout = useRef(null);
    const { theme, isDark } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showAccountPanel, setShowAccountPanel] = useState(false);
    const navigate = useNavigate();

    // User Account Details
    const [details, setDetails] = useState({
        username: 'Guest Account',
        position: 'User Admin',
        picture: default_picture,
    });

    // Content State
    const elements = useRef({
        // SERVICES
        analytics: () => (props) => (
            <PlantingReportProvider>
                <Analytics {...props} />
            </PlantingReportProvider>
        ),
        profiles: () => Profiles,
        enrollment: () => Seminar,
        eic: () => EIC,
        content: () => Content,
        distribution: () => Distribution,
        audit: () => Audit,
        survey: () => Survey,
        chat: () => Chat,
        plantingReports: () => (props) => (
            <PlantingReportProvider>
                <PlantingReports {...props} />
            </PlantingReportProvider>
        ),
        settings: () => Settings,

        // GLOBAL
        account: () => AccountProfile,
    });

    const [Page, setPage] = useState(elements.current.analytics); // [ analytics, enrollment, profiles, eic, audit, survey, content, distribution, chat ]
    const admin_navigate = (page) => {
        setPage(elements.current[page]);
    };

    //Initial Request on Mount
    useEffect(() => {
        (async () => {
            try {
                // Get Account Details
                const response = await fetch('/api/account/details/me');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }
                if (data.access === 'User') {
                    throw new Error(data.error);
                }

                // Socket.io removed - using HTTP polling for real-time features

                // Render State
                setDetails({
                    username: data.username,
                    position: data.position,
                    picture:
                        '/api/account/picture/me?refresh=' +
                        new Date().getTime(),
                    setProfile: setDetails,
                    access: data.access,
                });
            } catch (err) {
                // Prevent multiple 401 containers and listeners
                if (document.getElementById('unauthorized-401-container'))
                    return;

                const container = document.createElement('div');
                container.id = 'unauthorized-401-container';
                container.style.position = 'fixed';
                container.style.top = '0';
                container.style.left = '0';
                container.style.width = '100vw';
                container.style.height = '100vh';
                container.style.background =
                    'linear-gradient(135deg, #16a34a 0%, #064e3b 100%)';
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.justifyContent = 'center';
                container.style.zIndex = '99999';

                container.innerHTML = `
            <div style="
              background: rgba(255,255,255,0.97);
              border-radius: 1.5rem;
              box-shadow: 0 8px 32px 0 rgba(30,41,59,0.18);
              padding: 2.5rem 2.5rem 2rem 2.5rem;
              min-width: 340px;
              max-width: 95vw;
              text-align: center;
              font-family: inherit;
              border: 1.5px solid #e0e7ef;
              animation: fadeIn401 0.38s cubic-bezier(.4,2,.6,1) both;
            ">
              <div style="
          font-size:3.5rem;
          color:#16a34a;
          margin-bottom:0.5rem;
          font-weight:900;
          letter-spacing: -2px;
          line-height: 1;
              ">
          401
              </div>
              <div style="font-size:1.35rem; font-weight:700; margin-bottom:0.5rem; color:#1e293b;">
          Unauthorized Access
              </div>
              <div style="color:#64748b; margin-bottom:1.7rem; font-size:1.05rem;">
          You are not authorized to view this page.<br/>
          Please login to continue.
              </div>
              <button id="go-login-btn" style="
          background: linear-gradient(90deg,#16a34a 60%,#064e3b 100%);
          color: #fff;
          border: none;
          border-radius: 0.8rem;
          padding: 0.7rem 2.2rem;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: 0 2px 12px #16a34a22;
          cursor: pointer;
          transition: background 0.18s, transform 0.12s;
          outline: none;
          margin-top: 0.5rem;
          letter-spacing: 0.02em;
              ">
          Go to Login
              </button>
            </div>
            <style>
              @keyframes fadeIn401 {
          0% { opacity: 0; transform: translateY(32px) scale(0.97);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
              }
              #go-login-btn:active {
          transform: scale(0.97);
              }
              #go-login-btn:hover {
          background: linear-gradient(90deg,#15803d 60%,#064e3b 100%);
              }
            </style>
          `;

                document.body.appendChild(container);

                const remove401 = () => {
                    if (document.getElementById('unauthorized-401-container')) {
                        document.body.removeChild(container);
                        window.removeEventListener('keydown', escListener);
                    }
                };

                container.querySelector('#go-login-btn').onclick = () => {
                    remove401();
                    navigate('/login');
                };

                // Remove on ESC
                const escListener = (e) => {
                    if (e.key === 'Escape') {
                        remove401();
                        navigate('/login');
                    }
                };
                window.addEventListener('keydown', escListener);

                return;
            }
        })();
    }, []);

    // Switch Between Logout and Login
    const logging = async () => {
        // Ultra-modern logout confirmation modal (glassmorphism, animated, no alert/confirm, no blur bg)
        const confirmed = await new Promise((resolve) => {
            // Create modal container
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.background = 'rgba(30,41,59,0.25)'; // Lighter, minimalist overlay
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';
            modal.style.transition = 'background 0.3s';

            // Minimalist modal content, animated
            modal.innerHTML = `
      <div style="
        background: #fff;
        border-radius: 1rem;
        box-shadow: 0 8px 32px 0 rgba(30,41,59,0.13);
        padding: 2.2rem 2.2rem 1.7rem 2.2rem;
        min-width: 300px;
        max-width: 95vw;
        text-align: center;
        font-family: inherit;
        border: 1.5px solid #e0e7ef;
        animation: minimalFadeIn 0.32s cubic-bezier(.4,2,.6,1) both;
      ">
                <div style="
                    font-size:2.1rem;
                    color:#16a34a;
                    margin-bottom:0.5rem;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                ">
          <span style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.7rem;
        height: 2.7rem;
        border-radius: 50%;
        background: #e0e7ef;
        animation: minimalPop 0.38s cubic-bezier(.4,2,.6,1);
          ">
        <i class='fas fa-sign-out-alt'></i>
          </span>
        </div>
        <div style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem; color:#1e293b;">
          Logout?
        </div>
        <div style="color:#64748b; margin-bottom:1.5rem; font-size:1rem;">
          Are you sure you want to logout?
        </div>
        <div style="display:flex; gap:0.8rem; justify-content:center;">
                    <button id="modern-logout-yes" style="
                background: #16a34a;
                color: #fff;
                border: none;
                border-radius: 0.7rem;
                padding: 0.55rem 1.6rem;
                font-weight: 700;
                font-size: 1rem;
                box-shadow: 0 2px 8px #16a34a22;
                cursor: pointer;
                transition: background 0.18s, transform 0.12s;
                outline: none;
                    ">Logout</button>
          <button id="modern-logout-no" style="
        background: #f1f5f9;
        color: #222;
        border: none;
        border-radius: 0.7rem;
        padding: 0.55rem 1.6rem;
        font-weight: 700;
        font-size: 1rem;
        box-shadow: 0 2px 8px #64748b11;
        cursor: pointer;
        transition: background 0.18s, transform 0.12s;
        outline: none;
          ">Cancel</button>
        </div>
      </div>
      <style>
        @keyframes minimalFadeIn {
          0% { opacity: 0; transform: translateY(24px) scale(0.98);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        @keyframes minimalPop {
          0% { transform: scale(0.7); opacity: 0;}
          100% { transform: scale(1); opacity: 1;}
        }
        #modern-logout-yes:active, #modern-logout-no:active {
          transform: scale(0.97);
        }
                #modern-logout-yes:hover {
                    background: #15803d;
                }
        #modern-logout-no:hover {
          background: #e0e7ef;
        }
      </style>
      `;

            document.body.appendChild(modal);

            modal.querySelector('#modern-logout-yes').onclick = () => {
                document.body.removeChild(modal);
                resolve(true);
            };
            modal.querySelector('#modern-logout-no').onclick = () => {
                document.body.removeChild(modal);
                resolve(false);
            };

            // Allow ESC to close
            const escListener = (e) => {
                if (e.key === 'Escape') {
                    document.body.removeChild(modal);
                    resolve(false);
                    window.removeEventListener('keydown', escListener);
                }
            };
            window.addEventListener('keydown', escListener);
        });

        if (confirmed) {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'DELETE',
                    credentials: 'include', // Include cookies for authentication
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const result = await response.json();

                    // Clear any local storage or session storage if needed
                    localStorage.clear();
                    sessionStorage.clear();

                    // Navigate to login page
                    navigate('/login');
                } else {
                    // Handle error response
                    const errorData = await response.json();
                    console.error('Logout failed:', errorData.message);

                    // Still navigate to login even if logout fails on server
                    navigate('/login');
                }
            } catch (error) {
                console.error('Network error during logout:', error);

                // Still navigate to login even if there's a network error
                navigate('/login');
            }
        }
    };

    // Track the current page key for highlighting with localStorage persistence
    const [currentPageKey, setCurrentPageKey] = useState(() => {
        try {
            return localStorage.getItem('admin_current_page_key') || 'analytics';
        } catch {
            return 'analytics';
        }
    });

    // Update setPage to also update currentPageKey
    const handleSetPage = (key) => {
        setPage(elements.current[key]);
        setCurrentPageKey(key);
    };

    // Persist currentPageKey to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('admin_current_page_key', currentPageKey);
        } catch (error) {
            console.error('Failed to save current page key:', error);
        }
    }, [currentPageKey]);

    // Restore the correct page on mount based on localStorage
    useEffect(() => {
        if (elements.current[currentPageKey]) {
            setPage(elements.current[currentPageKey]);
        }
    }, []);

    // Scroll to top on route change
    const { pathname } = window.location;
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);


    return (
        <>
            {/* Import Poppins font from Google Fonts */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');`}</style>
            <div className={`flex min-h-screen h-screen ${
                isDark ? 'bg-gray-900' : 'bg-gray-50'
            }`} style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>
                {/* DESKTOP SIDEBAR */}
                <Sidebar
                    logging={logging}
                    details={details}
                    setPage={setPage}
                    elements={elements}
                    currentPageKey={currentPageKey}
                    handleSetPage={handleSetPage}
                    logo={logo}
                    theme={theme}
                    isDark={isDark}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-screen h-screen ml-0 transition-all dashboard-main-content">
                    <header className={`backdrop-blur-md shadow-lg px-8 py-3 flex items-center w-full fixed top-0 left-0 z-20 dashboard-header h-20 border-b professional-navbar ${
                        isDark 
                            ? 'bg-gray-800/90 border-gray-700' 
                            : 'bg-white/90 border-green-100'
                    }`} style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>
                        {/* Mobile: Menu button on left (moved from right) */}
                        <div className="flex md:hidden items-center gap-2">
                            <button
                                className={`transition ${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'}`}
                                onClick={() => setMobileMenuOpen(true)}
                                aria-label="Open menu"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h9"
                                    />
                                </svg>
                            </button>
                        </div>
                        {/* Desktop: Home button first, then menu bar button (unchanged) */}
                        <div className="hidden md:flex items-center">
                            <button
                                className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-bold shadow transition mr-4 ${
                                    isDark 
                                        ? 'bg-gray-700 border-gray-600 hover:bg-green-800 text-green-400' 
                                        : 'bg-white border-gray-300 hover:bg-green-200 text-green-700'
                                }`}
                                onClick={() => navigate('/')}
                                aria-label="Go to Landing Page"
                                style={{ letterSpacing: '0.01em' }}
                            >
                                <i className="fas fa-home text-xl"></i>
                                <span className="hidden sm:inline">Home</span>
                            </button>
                        </div>
                        {/* Centered dashboard title */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="flex items-center gap-2">
                                
                                     {/* Logo on mobile sidebar */}
                                {(() => {
                                    const item = menuItems.find(i => i.key === currentPageKey);
                                    return (
                                        <h1
                                            className={
                                                'text-lg md:text-2xl font-bold tracking-tight professional-navbar-title text-green-600 md:text-green-600 dark:text-green-400'
                                            }
                                            style={{ userSelect: 'none', letterSpacing: '-0.5px', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', display: 'flex', alignItems: 'center', gap: '0.7rem' }}
                                        >
                                            {item && item.icon && (
                                                <span className="hidden md:inline-flex md:-mt-1" style={{ fontSize: '1.15em', alignItems: 'center', marginRight: '0.55em', position: 'relative', top: '0px', lineHeight: 1, color: '#16a34a' }}>{item.icon}</span>
                                            )}
                                            <span style={{ verticalAlign: 'middle', lineHeight: 1 }}>{item ? item.label : 'Dashboard'}</span>
                                        </h1>
                                    );
                                })()}
                            </div>
                        </div>
                        {/* Settings icon (right) and mobile menu */}
                        <div className="flex items-center gap-2 ml-4">
                            {/* Modern Profile icon with animated dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => {
                                    if (profileDropdownTimeout.current) clearTimeout(profileDropdownTimeout.current);
                                    setProfileDropdownOpen(true);
                                }}
                                onMouseLeave={() => {
                                    profileDropdownTimeout.current = setTimeout(() => setProfileDropdownOpen(false), 300);
                                }}
                                tabIndex={0}
                                onFocus={() => setProfileDropdownOpen(true)}
                                onBlur={() => profileDropdownTimeout.current = setTimeout(() => setProfileDropdownOpen(false), 300)}
                            >
                                <button
                                    className={`flex items-center justify-center rounded-full shadow-lg transition-all duration-200 focus:outline-none ${
                                        isDark 
                                            ? 'bg-transparent border-2 border-green-500 hover:bg-green-900 text-green-300' 
                                            : 'bg-transparent border-2 border-green-500 hover:bg-green-100 text-green-700'
                                    }`}
                                    aria-label="Profile"
                                    style={{ boxShadow: isDark ? '0 4px 24px #0003' : '0 4px 24px #22c55e22', padding: 0, width: '40px', height: '40px' }}
                                >
                                    <img
                                        src={details.picture}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover transition-all duration-200"
                                        style={{ border: 'none' }}
                                    />
                                </button>
                                {/* Dropdown menu with fade/slide animation and delay */}
                                <div
                                    className={`absolute right-0 mt-3 w-48 rounded-2xl shadow-2xl border z-50 transition-all duration-300 ease-in-out ${profileDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                                    style={{
                                        boxShadow: isDark ? '0 8px 32px #0f172a55' : '0 8px 32px #22c55e22',
                                        backdropFilter: 'blur(8px)',
                                    }}
                                >
                                    <div className={`${isDark ? 'bg-gray-900 border border-gray-700 text-gray-100' : 'bg-white/95 border border-green-100' } rounded-2xl py-2`}>
                                        <button
                                            className={`w-full flex items-center gap-2 px-5 py-3 rounded-xl text-base font-semibold transition-all duration-150 ${isDark ? 'text-green-300 hover:bg-green-900/30' : 'text-green-700 hover:bg-green-100'}`}
                                            onClick={() => { setProfileDropdownOpen(false); handleSetPage('settings'); }}
                                        >
                                            <i className="fas fa-cog"></i> Settings
                                        </button>
                                        <button
                                            className={`w-full flex items-center gap-2 px-5 py-3 rounded-xl text-base font-semibold transition-all duration-150 ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-700 hover:bg-red-100'}`}
                                            onClick={() => { setProfileDropdownOpen(false); logging(); }}
                                        >
                                            <i className="fas fa-sign-out-alt"></i> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                className={`md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg font-bold shadow transition ${
                                    isDark 
                                        ? 'bg-gray-700 border-gray-600 hover:bg-green-800 text-green-400' 
                                        : 'bg-white border-gray-300 hover:bg-green-200 text-green-700'
                                }`}
                                onClick={() => navigate('/')}
                                aria-label="Go to Landing Page"
                                style={{ letterSpacing: '0.01em' }}
                            >
                                <i className="fas fa-home text-xl"></i>
                                <span className="hidden sm:inline">Home</span>
                            </button>
                        </div>
                    </header>
                    {/* Render children below the header */}
                    <main className={`flex-1 p-2 sm:p-6 overflow-auto pt-20 h-0 min-h-0 minimalist-scrollbar ${
                        isDark ? 'bg-gray-900' : 'bg-white/70'
                    }`}>
                        {currentPageKey === 'account' ? (
                            <div className="max-w-[22rem] w-full mx-auto">
                                <Page admin_navigate={admin_navigate} details={details} />
                            </div>
                        ) : (
                            <Page admin_navigate={admin_navigate} details={details} />
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu overlay"
                />
            )}
            {/* Mobile sidebar */}
            {!showAccountPanel && (
                <aside
                    className={`fixed inset-y-0 left-0 backdrop-blur-xl border-r shadow-2xl w-full max-w-xs z-50 transform transition-transform duration-300 ${
                        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:hidden flex flex-col h-screen max-h-screen ${
                        isDark 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-green-200'
                    }`}
                    id="mobile-menu"
                    style={{ boxShadow: '0 8px 32px 0 rgba(30,41,59,0.13), 0 1.5px 0 0 #2563eb22', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                >
                    <div className="flex flex-col h-full max-h-screen">
                        <div className={`p-6 border-b flex items-center justify-between shadow-sm ${
                            isDark 
                                ? 'border-gray-700 bg-gray-800' 
                                : 'border-green-200 bg-white'
                        }`}>
                            <div className="flex items-center gap-3">
                                <h1 className={`text-2xl font-extrabold tracking-tight drop-shadow-sm ${
                                    isDark ? 'text-green-400' : 'text-green-800'
                                }`} style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>FITS - TANZA</h1>
                            </div>
                            <button
                                className={`transition ${
                                    isDark ? 'text-green-500 hover:text-green-300' : 'text-green-500 hover:text-green-700'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 min-h-0 flex flex-col">
                            <nav className="mt-3 flex-1 overflow-y-auto minimalist-scrollbar">
                                <ul className="space-y-2 px-6 py-4">
                                    {(() => {
                                        const filteredMenuItems = menuItems.filter(item => item.key !== 'home');
                                        const beforeServices = filteredMenuItems.filter(item => !['distribution','enrollment','eic','content'].includes(item.key) && !['settings','profile','logout'].includes(item.key));
                                        const services = filteredMenuItems.filter(item => ['distribution','enrollment','eic','content'].includes(item.key));
                                        return (
                                            <>
                                                {/* Menu separator above Analytics */}
                                                <li style={{ padding: 0, textAlign: 'left', width: '100%', lineHeight: 1, minHeight: 'unset', marginBottom: 0 }}>
                                                    <div style={{display: 'flex', alignItems: 'center', width: '100%', minHeight: 'unset', lineHeight: 1}}>
                                                        <span style={{display: 'inline-block', height: 1, width: 10, borderBottom: isDark ? '1.5px solid #6b7280' : '1.5px solid #d1d5db', opacity: 0.7, marginRight: 18, verticalAlign: 'middle'}}></span>
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
                                                            marginBottom: 0,
                                                            lineHeight: 1.1,
                                                            height: '1.2em',
                                                            display: 'inline-block',
                                                            verticalAlign: 'middle'
                                                        }}>Menu</span>
                                                        <span style={{display: 'inline-block', height: 1, width: '100%', maxWidth: 100, borderBottom: isDark ? '1.5px solid #6b7280' : '1.5px solid #d1d5db', opacity: 0.7, marginLeft: 8, verticalAlign: 'middle'}}></span>
                                                    </div>
                                                </li>
                                                {beforeServices.map((item) => (
                                                    <li
                                                        key={item.key}
                                                        className={`flex items-center gap-4 px-5 py-3 text-lg rounded-xl transition cursor-pointer shadow-sm
                                                            ${
                                                                currentPageKey === item.key
                                                                    ? isDark 
                                                                        ? 'active-sidebar-link-dark'
                                                                        : 'active-sidebar-link-light'
                                                                    : isDark
                                                                        ? 'text-gray-300 hover:bg-green-900/30 hover:shadow-md'
                                                                        : 'text-gray-700 hover:bg-green-100/70 hover:shadow-md'
                                                            }
                                                        `}
                                                        style={{
                                                            minHeight: '3.2rem',
                                                            letterSpacing: '0.01em',
                                                            fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif',
                                                            borderRadius: '0.7rem',
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
                                                        onClick={() => {
                                                            if (item.to) {
                                                                window.location.href = item.to;
                                                            } else {
                                                                handleSetPage(item.key);
                                                            }
                                                            setMobileMenuOpen(false);
                                                        }}
                                                    >
                                                        <span className={`sidebar-icon flex items-center justify-center drop-shadow-sm ${
                                                            currentPageKey === item.key 
                                                                ? isDark ? 'text-green-400' : 'text-green-700/90'
                                                                : isDark ? 'text-green-500' : 'text-green-700/90'
                                                        }`}>{item.icon}</span>
                                                        <span className="sidebar-label font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', fontWeight: '500' }}>{item.label}</span>
                                                    </li>
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
                                                {services.map((item) => (
                                                    <li
                                                        key={item.key}
                                                        className={`flex items-center gap-4 px-5 py-3 text-lg rounded-xl transition cursor-pointer shadow-sm
                                                            ${
                                                                currentPageKey === item.key
                                                                    ? isDark 
                                                                        ? 'active-sidebar-link-dark'
                                                                        : 'active-sidebar-link-light'
                                                                    : isDark
                                                                        ? 'text-gray-300 hover:bg-green-900/30 hover:shadow-md'
                                                                        : 'text-gray-700 hover:bg-green-100/70 hover:shadow-md'
                                                            }
                                                        `}
                                                        style={{
                                                            minHeight: '3.2rem',
                                                            letterSpacing: '0.01em',
                                                            fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif',
                                                            borderRadius: '0.7rem',
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
                                                        onClick={() => {
                                                            if (item.to) {
                                                                window.location.href = item.to;
                                                            } else {
                                                                handleSetPage(item.key);
                                                            }
                                                            setMobileMenuOpen(false);
                                                        }}
                                                    >
                                                        <span className={`sidebar-icon flex items-center justify-center drop-shadow-sm ${
                                                            currentPageKey === item.key 
                                                                ? isDark ? 'text-green-400' : 'text-green-700/90'
                                                                : isDark ? 'text-green-500' : 'text-green-700/90'
                                                        }`}>{item.icon}</span>
                                                        <span className="sidebar-label font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', fontWeight: '500' }}>{item.label}</span>
                                                    </li>
                                                ))}
                                            </>
                                        );
                                    })()}
                                </ul>
                            </nav>
                        </div>
                        {/* Profile and Logout at the bottom, styled like desktop */}
                        {/* ...existing code... (removed profile, settings, and logout from mobile sidebar) */}
                    </div>
                </aside>
            )}

            {/* Account management overlay panel for mobile */}
            {showAccountPanel && (
                <div
                    className={`fixed inset-y-0 left-0 backdrop-blur-xl border-r w-full max-w-xs z-[60] flex flex-col h-screen max-h-screen shadow-2xl transition-all duration-300 ${
                        isDark 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-green-200'
                    }`}
                    style={{ boxShadow: '0 8px 32px 0 rgba(30,41,59,0.13), 0 1.5px 0 0 #2563eb22' }}
                >
                    <div className={`p-6 border-b flex items-center justify-between shadow-sm ${
                        isDark 
                            ? 'border-gray-700 bg-gray-800' 
                            : 'border-green-200 bg-white'
                    }`}>
                        <div className="flex items-center gap-3">
                            <h1 className={`text-2xl font-extrabold tracking-tight drop-shadow-sm ${
                                isDark ? 'text-green-400' : 'text-green-800'
                            }`}>Account</h1>
                        </div>
                        <button
                            className={`transition ${
                                isDark 
                                    ? 'text-green-500 hover:text-green-300' 
                                    : 'text-green-500 hover:text-green-700'
                            }`}
                            onClick={() => setShowAccountPanel(false)}
                            aria-label="Close account panel"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto p-4">
                        <AccountProfile details={details} />
                    </div>
                </div>
            )}

            {/* Mobile CSS for sidebar */}
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
                    font-family: 'Poppins', Inter, 'Segoe UI, Arial, sans-serif !important;
                    font-weight: 500 !important;
                }
                
                .sidebar-logout-text {
                    font-family: 'Poppins', Inter, 'Segoe UI', Arial, sans-serif !important;
                    font-weight: 600 !important;
                }
                
                .sidebar-icon {
                    width: 1.25rem !important;
                    height: 1.25rem !important;
                    min-width: 1.25rem !important;
                    min-height: 1.25rem !important;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem !important;
                }
                .sidebar-icon svg {
                    width: 1.25rem !important;
                    height: 1.25rem !important;
                }
                .sidebar-icon i {
                    width: 1.25rem !important;
                    height: 1.25rem !important;
                    font-size: 1.25rem !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>

            {/* Additional CSS for layout and fonts */}
            <style>{`
      /* Use Poppins font for headings and navbar */
      .professional-navbar, .professional-navbar-title, h1, h2, h3, h4, h5, h6 {
        font-family: 'Poppins', Inter, 'Segoe UI', Arial, sans-serif !important;
      }
      /* Fix: Only nav in mobile sidebar scrolls, no double scrollbar */
      @media (max-width: 751px) {
        aside#mobile-menu {
          overflow: hidden !important;
          height: 100vh;
          max-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        aside#mobile-menu > div {
          overflow: hidden !important;
          height: 100%;
          max-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        aside#mobile-menu nav {
          flex: 1 1 0%;
          overflow-y: auto !important;
          min-height: 0;
        }
        aside#mobile-menu ul {
          overflow: visible !important;
        }
      }
      .professional-navbar {
        box-shadow: 0 4px 24px 0 ${isDark ? '#00000020' : '#2563eb13'};
        border-bottom: 2px solid ${isDark ? '#374151' : '#dbeafe'};
        background: ${isDark ? '#111827' : '#fff'};
        padding-left: 2rem !important;
        padding-right: 2rem !important;
        padding-top: 0.75rem !important;
        padding-bottom: 0.75rem !important;
        height: 5rem !important;
      }
      .professional-navbar-title {
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        font-weight: 700;
        color: ${isDark ? '#f9fafb' : '#1e293b'};
        letter-spacing: -0.5px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .minimalist-scrollbar::-webkit-scrollbar {
        width: 8px;
        background: transparent;
      }
      .minimalist-scrollbar::-webkit-scrollbar-thumb {
        background: ${isDark ? '#4b5563' : '#e5e7eb'};
        border-radius: 4px;
      }
      .minimalist-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: ${isDark ? '#4b5563' : '#e5e7eb'} transparent;
      }
      html, body, #root {
        height: 100%;
      }
      /* Responsive main content margin/width based on sidebar size */
      @media (min-width: 751px) and (max-width: 1300px) {
        .dashboard-main-content {
          margin-left: 16rem !important;
          width: calc(100% - 16rem) !important;
        }
        .dashboard-header {
          left: 16rem !important;
          width: calc(100% - 16rem) !important;
        }
      }
      @media (min-width: 1300px) {
        .dashboard-main-content {
          margin-left: 16rem !important;
          width: calc(100% - 16rem) !important;
        }
        .dashboard-header {
          left: 16rem !important;
          width: calc(100% - 16rem) !important;
        }
      }
      @media (max-width: 751px) {
        .dashboard-main-content {
          margin-left: 0 !important;
          width: 100% !important;
        }
        .dashboard-header {
          left: 0 !important;
          width: 100% !important;
        }
      }
      /* Sidebar default mode */
      .sidebar,
      .sidebar-icon-only {
        top: 0 !important;
      }
      /* Responsive sidebar/mobile nav link sizing */
      #mobile-menu li {
        min-height: 4rem !important;
        height: 4rem !important;
        width: 100% !important;
        box-sizing: border-box;
      }
      #mobile-menu li > .flex {
        min-height: 4rem !important;
        height: 4rem !important;
        align-items: center !important;
      }
        
    `}</style>
        </>
    );
}
