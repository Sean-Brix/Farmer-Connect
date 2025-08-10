import { useEffect, useState, useRef } from 'react';
import logo from '../../../Assets/Logo.png';
import { useNavigate } from 'react-router-dom';
import default_picture from '../../../Assets/default_picture.png';

// SERVICES
import Analytics from '../../Services/Analytics/Analytics';
import Profiles from '../../Services/Profiles/Profiles.jsx';
import Seminar from '../../Services/Seminar/Seminar.jsx';
import EIC from '../../Services/EIC/EIC.jsx';
import Content from '../../Services/Inventory/Inventory.jsx';
import Distribution from '../../Services/Distribution/Distribution.jsx';
import Chat from '../../Services/Customer_Service/Chat_Module.jsx';
import Survey from '../../Services/Survey/Survey.jsx';
import Seed_Track from '../../Services/Seed_track/Seed.jsx';

// GLOBAL
import AccountProfile from '../../../Components/settings/AccountProfile/AccountProfile.jsx';

// SUB COMPONENT
import Sidebar from './sub/Sidebar.jsx';
import Audit from '../../Services/Logs/Audit.jsx';

export default function Dashboard() {
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
        analytics: () => Analytics,
        profiles: () => Profiles,
        enrollment: () => Seminar,
        eic: () => EIC,
        content: () => Content,
        distribution: () => Distribution,
        audit: () => Audit,
        survey: () => Survey,
        chat: () => Chat,
        seed: () => Seed_Track,

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
                    'linear-gradient(135deg, #2563eb 0%, #1e293b 100%)';
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
          color:#2563eb;
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
          background: linear-gradient(90deg,#2563eb 60%,#1e293b 100%);
          color: #fff;
          border: none;
          border-radius: 0.8rem;
          padding: 0.7rem 2.2rem;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: 0 2px 12px #2563eb22;
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
          background: linear-gradient(90deg,#1d4ed8 60%,#1e293b 100%);
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
          color:#2563eb;
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
        background: #2563eb;
        color: #fff;
        border: none;
        border-radius: 0.7rem;
        padding: 0.55rem 1.6rem;
        font-weight: 700;
        font-size: 1rem;
        box-shadow: 0 2px 8px #2563eb22;
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
          background: #1d4ed8;
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

    // Track the current page key for highlighting
    const [currentPageKey, setCurrentPageKey] = useState('analytics');

    // Update setPage to also update currentPageKey
    const handleSetPage = (key) => {
        setPage(elements.current[key]);
        setCurrentPageKey(key);
    };

    // Scroll to top on route change
    const { pathname } = window.location;
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);


    return (
        <>
            {/* Import Poppins font from Google Fonts */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');`}</style>
            <div className="flex min-h-screen h-screen bg-gray-50" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>
                {/* DESKTOP SIDEBAR */}
                <Sidebar
                    logging={logging}
                    details={details}
                    setPage={setPage}
                    elements={elements}
                    currentPageKey={currentPageKey}
                    handleSetPage={handleSetPage}
                    logo={logo}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-screen h-screen ml-0 transition-all dashboard-main-content">
                    <header className="bg-white/90 backdrop-blur-md shadow-lg px-8 py-3 flex items-center w-full fixed top-0 left-0 z-20 dashboard-header h-20 border-b border-green-100 professional-navbar" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>
                        {/* Home button (left) */}
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-green-200 rounded-lg text-green-700 font-bold shadow transition mr-4"
                            onClick={() => navigate('/')}
                            aria-label="Go to Landing Page"
                            style={{ letterSpacing: '0.01em' }}
                        >
                            <i className="fas fa-home text-xl"></i>
                            <span className="hidden sm:inline">Home</span>
                        </button>
                        {/* Centered dashboard title */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="flex items-center gap-2">
                                
                                     {/* Logo on mobile sidebar */}
                            <img src={logo} alt="Logo" className="h-10 w-10 object-contain mr-2" />
                                <h1
                                    className="text-lg md:text-2xl font-bold text-green-900 tracking-tight professional-navbar-title"
                                    style={{ userSelect: 'none', letterSpacing: '-0.5px', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                                >
                                   DASHBOARD  
                                </h1>
                            </div>
                        </div>
                        {/* Settings icon (right) and mobile menu */}
                        <div className="flex items-center gap-2 ml-4">
                            <button
                                className="flex items-center justify-center p-3 bg-white border border-gray-300 hover:bg-green-200 rounded-full text-green-700 shadow transition"
                                onClick={() => handleSetPage('settings')}
                                aria-label="Settings"
                            >
                                <i className="fas fa-cog text-xl"></i>
                            </button>
                            <button
                                className="md:hidden text-green-600 hover:text-green-800 transition ml-2"
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
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </header>
                    {/* Render children below the header */}
                    <main className="flex-1 p-2 sm:p-6 overflow-auto pt-20 h-0 min-h-0 minimalist-scrollbar bg-white/70">
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
                    className={`fixed inset-y-0 left-0 bg-white backdrop-blur-xl border-r border-green-200 w-full max-w-xs z-50 transform transition-transform duration-300 ${
                        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:hidden flex flex-col h-screen max-h-screen shadow-2xl`}
                    id="mobile-menu"
                    style={{ boxShadow: '0 8px 32px 0 rgba(30,41,59,0.13), 0 1.5px 0 0 #2563eb22' }}
                >
                    <div className="flex flex-col h-full max-h-screen">
                        <div className="p-6 border-b border-green-200 bg-white flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-extrabold text-green-800 tracking-tight drop-shadow-sm">FITS - TANZA</h1>
                            </div>
                            <button
                                className="text-green-500 hover:text-green-700 transition"
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
                                <ul className="space-y-2 px-3 max-h-[70vh]">
                                {/* Analytics */}
                                <li
                                    className={`flex items-center gap-4 px-5 py-3 text-lg rounded-xl transition cursor-pointer w-full h-16 min-h-[4rem] shadow-sm ${
                                        currentPageKey === 'analytics'
                                            ? 'bg-gradient-to-r from-green-200/80 to-green-100/80 font-bold text-green-800'
                                            : 'text-gray-700 hover:bg-green-100/70 hover:shadow-md'
                                    }`}
                                    onClick={() => {
                                        handleSetPage('analytics');
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{ minHeight: '4rem', letterSpacing: '0.01em', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                                >
                                    <span className="text-green-700/90 text-xl drop-shadow-sm">
                                        <i className="fas fa-chart-line h-6 w-6"></i>
                                    </span>
                                    <span className="font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>Analytics</span>
                                </li>
                                {/* User Profiles */}
                                <li
                                    className={`flex items-center gap-4 px-5 py-3 text-lg rounded-xl transition cursor-pointer w-full h-16 min-h-[4rem] shadow-sm ${
                                        currentPageKey === 'profiles'
                                            ? 'bg-gradient-to-r from-green-200/80 to-green-100/80 font-bold text-green-800'
                                            : 'text-gray-700 hover:bg-green-100/70 hover:shadow-md'
                                    }`}
                                    onClick={() => {
                                        handleSetPage('profiles');
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{ minHeight: '4rem', letterSpacing: '0.01em', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                                >
                                    <span className="text-green-700/90 text-xl drop-shadow-sm">
                                        <i className="fas fa-user-circle h-6 w-6"></i>
                                    </span>
                                    <span className="font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>User Profiles</span>
                                </li>
                                {/* Seminar Programs */}
                                <li
                                    className={`flex items-center gap-4 px-5 py-3 text-lg rounded-xl transition cursor-pointer w-full h-16 min-h-[4rem] shadow-sm ${
                                        currentPageKey === 'enrollment'
                                            ? 'bg-gradient-to-r from-green-200/80 to-green-100/80 font-bold text-green-800'
                                            : 'text-gray-700 hover:bg-green-100/70 hover:shadow-md'
                                    }`}
                                    onClick={() => {
                                        handleSetPage('enrollment');
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{ minHeight: '4rem', letterSpacing: '0.01em', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                                >
                                    <span className="text-green-700/90 text-xl drop-shadow-sm">
                                        <i className="fas fa-user-plus h-6 w-6"></i>
                                    </span>
                                    <span className="font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>Seminars </span>
                                </li>
                                {/* EIC */}
                                <li
                                    className={`flex items-center gap-4 px-5 py-3 text-lg rounded-xl transition cursor-pointer w-full h-16 min-h-[4rem] shadow-sm ${
                                        currentPageKey === 'eic'
                                            ? 'bg-gradient-to-r from-green-200/80 to-green-100/80 font-bold text-green-800'
                                            : 'text-gray-700 hover:bg-green-100/70 hover:shadow-md'
                                    }`}
                                    onClick={() => {
                                        handleSetPage('eic');
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{ minHeight: '4rem', letterSpacing: '0.01em', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                                >
                                    <span className="text-green-700/90 text-xl drop-shadow-sm">
                                        <i className="fas fa-id-card h-6 w-6"></i>
                                    </span>
                                    <span className="font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>EIC - Item Panel</span>
                                </li>
                                {/* Distribution */}
                                <li
                                    className={`flex items-center gap-4 px-5 py-3 text-lg rounded-xl transition cursor-pointer w-full h-16 min-h-[4rem] shadow-sm ${
                                        currentPageKey === 'distribution'
                                            ? 'bg-gradient-to-r from-green-200/80 to-green-100/80 font-bold text-green-800'
                                            : 'text-gray-700 hover:bg-green-100/70 hover:shadow-md'
                                    }`}
                                    onClick={() => {
                                        handleSetPage('distribution');
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{ minHeight: '4rem', letterSpacing: '0.01em', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                                >
                                    <span className="text-green-700/90 text-xl drop-shadow-sm">
                                        <i className="fas fa-box-open h-6 w-6"></i>
                                    </span>
                                    <span className="font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>Distributions</span>
                                </li>
                                {/* Content Management */}
                                <li
                                    className={`flex items-center gap-4 px-5 py-3 text-lg rounded-xl transition cursor-pointer w-full h-16 min-h-[4rem] shadow-sm ${
                                        currentPageKey === 'content'
                                            ? 'bg-gradient-to-r from-green-200/80 to-green-100/80 font-bold text-green-800'
                                            : 'text-gray-700 hover:bg-green-100/70 hover:shadow-md'
                                    }`}
                                    onClick={() => {
                                        handleSetPage('content');
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{ minHeight: '4rem', letterSpacing: '0.01em', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                                >
                                    <span className="text-green-700/90 text-xl drop-shadow-sm">
                                        <i className="fas fa-archive h-6 w-6"></i>
                                    </span>
                                    <span className="font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>Inventory</span>
                                </li>
                                {/* Audit */}
                                <li
                                    className={`flex items-center gap-4 px-5 py-3 text-lg rounded-xl transition cursor-pointer w-full h-16 min-h-[4rem] shadow-sm ${
                                        currentPageKey === 'audit'
                                            ? 'bg-gradient-to-r from-green-200/80 to-green-100/80 font-bold text-green-800'
                                            : 'text-gray-700 hover:bg-green-100/70 hover:shadow-md'
                                    }`}
                                    onClick={() => {
                                        handleSetPage('audit');
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{ minHeight: '4rem', letterSpacing: '0.01em', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                                >
                                    <span className="text-green-700/90 text-xl drop-shadow-sm">
                                        <i className="fas fa-clipboard-list h-6 w-6"></i>
                                    </span>
                                    <span className="font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>Logs / Audit Trail</span>
                                </li>
                                {/* Survey */}
                                <li
                                    className={`flex items-center gap-4 px-5 py-3 text-lg rounded-xl transition cursor-pointer w-full h-16 min-h-[4rem] shadow-sm ${
                                        currentPageKey === 'survey'
                                            ? 'bg-gradient-to-r from-green-200/80 to-green-100/80 font-bold text-green-800'
                                            : 'text-gray-700 hover:bg-green-100/70 hover:shadow-md'
                                    }`}
                                    onClick={() => {
                                        handleSetPage('survey');
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{ minHeight: '4rem', letterSpacing: '0.01em', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                                >
                                    <span className="text-green-700/90 text-xl drop-shadow-sm">
                                        <i className="fas fa-poll h-6 w-6"></i>
                                    </span>
                                    <span className="font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>Survey Forms</span>
                                </li>
                                {/* Settings */}
                                <li
                                    className={`flex items-center gap-4 px-5 py-3 text-lg rounded-xl transition cursor-pointer w-full h-16 min-h-[4rem] shadow-sm ${
                                        currentPageKey === 'settings'
                                            ? 'bg-gradient-to-r from-green-200/80 to-green-100/80 font-bold text-green-800'
                                            : 'text-gray-700 hover:bg-green-100/70 hover:shadow-md'
                                    }`}
                                    onClick={() => {
                                        handleSetPage('settings');
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{ minHeight: '4rem', letterSpacing: '0.01em', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}
                                >
                                    <span className="text-green-700/90 text-xl drop-shadow-sm">
                                        <i className="fas fa-cog h-6 w-6"></i>
                                    </span>
                                    <span className="font-medium tracking-tight" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>Settings</span>
                                </li>
                            </ul>
                        </nav>
                        {/* Profile and Logout at the bottom, styled like desktop */}
                        <div className="p-6 border-t border-green-200 flex flex-col items-center mt-auto bg-white shadow-inner">
                        <div className="flex items-center mb-5 w-full gap-4 cursor-pointer hover:bg-green-100/60 rounded-xl p-3 transition shadow-sm"
                            onClick={() => {
                                if (window.innerWidth <= 751) {
                                    setMobileMenuOpen(false);
                                    setTimeout(() => setShowAccountPanel(true), 300);
                                } else {
                                    setPage(elements.current['account']);
                                }
                            }}
                            style={{ minHeight: '4.2rem' }}
                        >
            {/* Account management overlay panel for mobile */}
            {showAccountPanel && (
                <div
                    className="fixed inset-y-0 left-0 bg-white backdrop-blur-xl border-r border-green-200 w-full max-w-xs z-[60] flex flex-col h-screen max-h-screen shadow-2xl transition-all duration-300"
                    style={{ boxShadow: '0 8px 32px 0 rgba(30,41,59,0.13), 0 1.5px 0 0 #2563eb22' }}
                >
                    <div className="p-6 border-b border-green-200 bg-white flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-extrabold text-green-800 tracking-tight drop-shadow-sm">Account</h1>
                        </div>
                        <button
                            className="text-green-500 hover:text-green-700 transition"
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
                            <img
                                src={details.picture}
                                alt="Profile"
                                className="h-12 w-12 rounded-full object-cover border-2 border-green-300 shadow"
                                style={{ background: '#e0e7ef' }}
                            />
                            <div className="flex flex-col sidebar-profile-info">
                                <span className="font-bold text-green-900 sidebar-username text-base tracking-tight drop-shadow-sm">
                                    {details.username}
                                </span>
                                <span className="text-sm text-green-500 sidebar-position font-medium">
                                    {details.position}
                                </span>
                            </div>
                        </div>
                            {/* Logout button (mobile sidebar, bottom) */}
                            <button
                                className="flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-green-100  rounded-xl transition text-green-800 w-full border border-green-200 font-bold text-base shadow-md hover:shadow-lg sidebar-logout-btn"
                                onClick={logging}
                                style={{ letterSpacing: '0.01em' }}
                            >
                                <span>
                                    <i className="fas fa-sign-out-alt h-5 w-5"></i>
                                </span>
                                <span className="sidebar-logout-text">Logout</span>
                            </button>
                        </div>
                        </div>


                </div>
            </aside>
        )}

            {/* Minimalist scrollbar utility and sidebar icon-only mode */}
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
        box-shadow: 0 4px 24px 0 #2563eb13;
        border-bottom: 2px solid #dbeafe;
        background: #fff;
        padding-left: 2rem !important;
        padding-right: 2rem !important;
        padding-top: 0.75rem !important;
        padding-bottom: 0.75rem !important;
        height: 5rem !important;
      }
      .professional-navbar-title {
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        font-weight: 700;
        color: #1e293b;
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
        background: #e5e7eb;
        border-radius: 4px;
      }
      .minimalist-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #e5e7eb transparent;
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
