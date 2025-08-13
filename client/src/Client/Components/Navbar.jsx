import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../Assets/Logo.png';
import Chat from '../../Components/Chats/Chat.jsx';
import logo2 from '../Assets/farmerconnect.png'; // Updated logo import
export default function Navbar({refresh}) {
    const location = useLocation();
    // Inject Google Fonts Poppins if not already present
    if (typeof document !== 'undefined' && !document.getElementById('poppins-font')) {
        const link = document.createElement('link');
        link.id = 'poppins-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(link);
    }
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    const [user, setUser] = useState({
        avatar: '/api/account/picture/me',
        name: 'Guest User',
    });

    const [infoOpen, setInfoOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    // Helper to determine if we are in the "mid" screen size (750px - 1050px)
    const [isMidScreen, setIsMidScreen] = useState(false);

    useEffect(() => {

        async function isAuthenticated() {

            try {
                const response = await fetch('/auth/is-authenticated');
    
                const data = await response.json();

                if(!data.check) {
                    setLoggedIn(false);
                        setUser({
                        avatar: '/api/account/picture/me?refresh=' + new Date().getTime(),
                        name: 'Guest User',
                    });
                    return;
                }

                setLoggedIn(true);
                setUser({
                    avatar: '/api/account/picture/me?refresh=' + new Date().getTime(),
                    name: data.payload.username,
                });
            }

            catch (error) {
                console.error('Error checking authentication:', error);
                setLoggedIn(false);
            }
    
        }

        function handleResize() {
            const width = window.innerWidth;
            setIsMidScreen(width >= 750 && width <= 1050);
        }

        isAuthenticated();
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, []);

    useEffect(()=>{

        setUser((prev)=>({
            ...prev,
            avatar: '/api/account/picture/me?refresh=' + new Date().getTime(),
        }))

    }, [refresh]);

    // Add a state to simulate logout
    const [showAlert, setShowAlert] = useState(false);

    // Helper for logout
    const handleLogout = async () => {

        try {
            const response = await fetch('/auth/logout', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Logout failed');
            }
        
            setLoggedIn(false);
            setOpen(false);
            setShowAlert(true);

            // Show alert for 10 seconds, then fade out smoothly
            setTimeout(() => {
                // Start fade out by adding a class
                const alert = document.getElementById('logout-alert');
                if (alert) {
                alert.classList.add('opacity-0');
                }
                // Wait for fade-out transition, then hide alert
                setTimeout(() => setShowAlert(false), 1000);
            }, 120000); // 20 seconds

            navigate('/login');
        } 
        catch (error) {
            console.error('Logout error:', error);
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 5000); // Hide alert after 5 seconds
            return;
        }
    };

    // Scroll to top on route change and on refresh
    useEffect(() => {
        // Always scroll to top on mount (refresh)
        window.scrollTo(0, 0);

        const handleScrollToTop = () => {
            window.scrollTo(0, 0);
        };
        // Listen for popstate (browser navigation)
        window.addEventListener('popstate', handleScrollToTop);

        // Listen for pushState/replaceState (programmatic navigation)
        const origPushState = window.history.pushState;
        const origReplaceState = window.history.replaceState;
        window.history.pushState = function (...args) {
            origPushState.apply(this, args);
            handleScrollToTop();
        };
        window.history.replaceState = function (...args) {
            origReplaceState.apply(this, args);
            handleScrollToTop();
        };

        return () => {
            window.removeEventListener('popstate', handleScrollToTop);
            window.history.pushState = origPushState;
            window.history.replaceState = origReplaceState;
        };
    }, []);
    

    // Helper: is any of the Info links active?
    const infoActive = ['/about', '/contact'].some((path) => location.pathname.startsWith(path));
    // Helper: is any of the Services links active?
    const servicesActive = ['/seminar', '/eic', '/distribution', '/chat-support', '/report'].some((path) => location.pathname.startsWith(path));

    const closeProfileTimeout = useRef();

    return (
        <>
            <style>
                {`
                    .dropdown-animate {
                        animation: dropdown-fade-in 0.35s cubic-bezier(.4,0,.2,1);
                    }
                    @keyframes dropdown-fade-in {
                        0% { opacity: 0; transform: translateY(-24px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    
                    /* Mobile Menu Animations */
                    @keyframes mobileBackdropFadeIn {
                        0% { 
                            opacity: 0; 
                        }
                        100% { 
                            opacity: 1; 
                        }
                    }
                    
                    @keyframes mobileSlideInLeft {
                        0% { 
                            transform: translateX(-100%); 
                            opacity: 0;
                        }
                        100% { 
                            transform: translateX(0); 
                            opacity: 1;
                        }
                    }
                    
                    /* Mobile Menu Item Stagger Animation */
                    .mobile-menu-item {
                        animation: mobileItemSlideIn 0.4s ease-out forwards;
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    
                    .mobile-menu-item:nth-child(1) { animation-delay: 0.1s; }
                    .mobile-menu-item:nth-child(2) { animation-delay: 0.15s; }
                    .mobile-menu-item:nth-child(3) { animation-delay: 0.2s; }
                    .mobile-menu-item:nth-child(4) { animation-delay: 0.25s; }
                    .mobile-menu-item:nth-child(5) { animation-delay: 0.3s; }
                    .mobile-menu-item:nth-child(6) { animation-delay: 0.35s; }
                    .mobile-menu-item:nth-child(7) { animation-delay: 0.4s; }
                    
                    @keyframes mobileItemSlideIn {
                        0% { 
                            opacity: 0; 
                            transform: translateX(-20px); 
                        }
                        100% { 
                            opacity: 1; 
                            transform: translateX(0); 
                        }
                    }
                    
                    .mobile-sidebar-force {
                        z-index: 9999 !important;
                        position: fixed !important;
                        background-color: white !important;
                    }
                    .mobile-backdrop-force {
                        z-index: 9998 !important;
                        position: fixed !important;
                    }
                    
                    /* Smooth underline animation for navbar links */
                    .nav-link-animated {
                        position: relative;
                        font-size: 16px;
                        color: rgba(255, 255, 255, 0.85);
                        font-weight: 500;
                        cursor: pointer;
                        text-transform: none;
                        transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
                        transition-duration: 400ms;
                        transition-property: color, transform;
                        padding: 0.75rem 1rem;
                        border-radius: 0.5rem;
                    }
                    
                    .nav-link-animated:focus,
                    .nav-link-animated:hover,
                    .nav-link-animated.active {
                        color: #ffffff;
                        transform: translateY(-1px);
                    }
                    
                    /* Text-only underline effect */
                    .nav-text-underline {
                        position: relative;
                        display: inline-block;
                    }
                    
                    .nav-link-animated:focus .nav-text-underline:after,
                    .nav-link-animated:hover .nav-text-underline:after,
                    .nav-link-animated.active .nav-text-underline:after {
                        width: 100%;
                        left: 0%;
                    }
                    
                    .nav-text-underline:after {
                        content: "";
                        pointer-events: none;
                        bottom: -4px;
                        left: 50%;
                        position: absolute;
                        width: 0%;
                        height: 3px;
                        background: linear-gradient(90deg, #ffffff, #f0fdf4, #ffffff);
                        border-radius: 2px;
                        transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
                        transition-duration: 400ms;
                        transition-property: width, left;
                        box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
                    }
                    
                    /* Enhanced dropdown animations */
                    .nav-link-animated svg {
                        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
                        transition: all 0.3s ease;
                    }
                    
                    .nav-link-animated:hover svg,
                    .nav-link-animated.active svg {
                        transform: scale(1.05);
                    }
                `}
            </style>
            <Chat />
            {showAlert && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center  bg-black/70 transition-all duration-300">
                    <div
                        id="logout-alert"
                        className="bg-white rounded-2xl shadow-xl px-7 py-7 flex flex-col items-center gap-5 border border-green-100 transition-all duration-500 animate-fade-in-up"
                        style={{ minWidth: 220, maxWidth: 300 }}
                    >
                        <svg
                            className="w-8 h-8 text-green-500 animate-bounce"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="#22c55e"
                                strokeWidth="2.2"
                                fill="#dcfce7"
                            />
                            <path
                                d="M12 16h.01M12 8a2 2 0 012 2c0 1-2 2-2 4"
                                stroke="#16a34a"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-base font-semibold text-green-700 text-center">Logout?</span>
                        <span className="block text-gray-500 text-sm text-center">You will need to login again.</span>
                        <div className="flex gap-2 mt-1">
                        <button
                            className="px-5 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                            <button
                                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 focus:outline-none"
                                onClick={() => setShowAlert(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <nav className="bg-gradient-to-r from-green-700 via-green-800 to-emerald-800 shadow-xl fixed w-full z-[9999] top-0 left-0 backdrop-blur-md border-b border-white/10" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-2 text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <img
                        src={logo2}
                        alt="FITS -Tanza Logo"
                        className="w-12 h-12 object-contain ml-2 rounded-full shadow-lg ring-2 ring-white/30"
                    />
                    <Link
                        to="/"
                        className="flex items-center gap-3 font-bold text-xl px-3 text-white md:text-2xl hover:text-white/90 transition-colors duration-300"
                    >
                        FITS -Tanza
                    </Link>
                    <div className="flex-1 flex justify-center">
                        <ul className="hidden md:flex items-center gap-6 lg:gap-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `nav-link-animated group flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 ${isActive ? 'active' : ''}`
                                    }
                                >
                                    <svg
                                        className="w-5 h-5 transition-colors duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    {!isMidScreen && <span className="nav-text-underline">Home</span>}
                                </NavLink>
                            </li>
                            <li 
                                className="relative group"
                                onMouseEnter={() => {
                                    if (window.infoMenuTimeout) clearTimeout(window.infoMenuTimeout);
                                    if (window.servicesMenuTimeout) clearTimeout(window.servicesMenuTimeout);
                                    setServicesOpen(false);
                                    setInfoOpen(true);
                                }}
                                onMouseLeave={() => {
                                    window.infoMenuTimeout = setTimeout(() => setInfoOpen(false), 180);
                                }}
                            >
                                <button
                                    type="button"
                                    tabIndex={0}
                                    className={`nav-link-animated group flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 focus:outline-none ${infoActive ? 'active' : ''}`}
                                >
                                    <svg
                                        className="w-5 h-5 transition-colors duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                        <path
                                            d="M8 12l2 2 4-4"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    {!isMidScreen && <span className="nav-text-underline">Information</span>}
                                    <svg
                                        className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                                            infoOpen ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M19 9l-7 7-7-7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <ul
                                    className={`absolute left-0 mt-3 w-52 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-[60] border border-white/30 transition-all duration-300 ${
                                        infoOpen
                                            ? 'opacity-100 translate-y-0 pointer-events-auto dropdown-animate'
                                            : 'opacity-0 -translate-y-6 pointer-events-none'
                                    }`}
                                    style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                                >
                                    <li>
                                        <NavLink
                                            to="/about"
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-green-50 hover:text-green-800 rounded-xl transition-all duration-200 font-medium mx-2 ${isActive ? 'bg-green-100 text-green-900' : ''}`
                                            }
                                        >
                                            <svg
                                                className="w-5 h-5 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M13 16h-1v-4h-1m1-4h.01"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                            About
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/contact"
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-green-50 hover:text-green-800 rounded-xl transition-all duration-200 font-medium mx-2 ${isActive ? 'bg-green-100 text-green-900' : ''}`
                                            }
                                        >
                                            <svg
                                                className="w-5 h-5 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M21 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h5.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M21 10.5l-9 6.5-9-6.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            Contact
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li 
                                className="relative group"
                                onMouseEnter={() => {
                                    if (window.servicesMenuTimeout) clearTimeout(window.servicesMenuTimeout);
                                    if (window.infoMenuTimeout) clearTimeout(window.infoMenuTimeout);
                                    setInfoOpen(false);
                                    setServicesOpen(true);
                                }}
                                onMouseLeave={() => {
                                    window.servicesMenuTimeout = setTimeout(() => setServicesOpen(false), 180);
                                }}
                            >
                                <button
                                    type="button"
                                    tabIndex={0}
                                    className={`nav-link-animated group flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 focus:outline-none ${servicesActive ? 'active' : ''}`}
                                >
                                    <svg
                                        className="w-5 h-5 transition-colors duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M4 6h16M4 12h16M4 18h16"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    {!isMidScreen && <span className="nav-text-underline">Services</span>}
                                    <svg
                                        className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                                            servicesOpen ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M19 9l-7 7-7-7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <ul
                                    className={`absolute left-0 mt-2 w-60 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl py-4 z-[60] border border-white/20 transition-all duration-300 ${
                                        servicesOpen
                                            ? 'opacity-100 translate-y-0 pointer-events-auto dropdown-animate'
                                            : 'opacity-0 -translate-y-6 pointer-events-none'
                                    }`}
                                >
                                    <li>
                                        <NavLink
                                            to="/seminar"
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-6 py-3 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium ${isActive ? 'bg-emerald-100 text-emerald-900' : ''}`
                                            }
                                        >
                                            <svg
                                                className="w-5 h-5 text-emerald-500"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M8 17l4 4 4-4m-4-5v9"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M20 12a8 8 0 10-16 0 8 8 0 0016 0z"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            Seminar Programs
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/eic"
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-6 py-3 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium ${isActive ? 'bg-emerald-100 text-emerald-900' : ''}`
                                            }
                                        >
                                            <svg
                                                className="w-5 h-5 text-emerald-500"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <rect
                                                    x="4"
                                                    y="4"
                                                    width="16"
                                                    height="16"
                                                    rx="4"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                />
                                                <path
                                                    d="M8 12h8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            EIC
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/distribution"
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-6 py-3 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium ${isActive ? 'bg-emerald-100 text-emerald-900' : ''}`
                                            }
                                        >
                                            <svg
                                                className="w-5 h-5 text-emerald-500"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M3 17v-6a2 2 0 012-2h14a2 2 0 012 2v6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M16 21v-4a2 2 0 00-2-2H10a2 2 0 00-2 2v4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            Distribution
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink
                                            to="/chat-support"
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-6 py-3 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium ${isActive ? 'bg-emerald-100 text-emerald-900' : ''}`
                                            }
                                        >
                                            <svg
                                                className="w-5 h-5 text-emerald-500"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            Chat Support
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink
                                            to="/report"
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-6 py-3 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium ${isActive ? 'bg-emerald-100 text-emerald-900' : ''}`
                                            }
                                        >
                                            <svg
                                                className="w-5 h-5 text-emerald-500"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 15h-2v-2h2zm0-4h-2V7h2z"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                />
                                            </svg>

                                            Report
                                        </NavLink>
                                    </li>
                                    
                            {/* Survey link removed */}
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className="flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {loggedIn ? (
                            <div
                                className="relative hidden md:block"
                                onMouseEnter={() => {
                                    if (closeProfileTimeout.current) clearTimeout(closeProfileTimeout.current);
                                    setOpen(true);
                                }}
                                onMouseLeave={() => {
                                    closeProfileTimeout.current = setTimeout(() => setOpen(false), 250); // 250ms delay
                                }}
                            >
                                <button
                                    className="flex items-center justify-center w-11 h-11 rounded-full bg-green-600 hover:bg-green-700 transition-all duration-300 focus:outline-none shadow-lg border-2 border-white/30 hover:border-white/50 hover:scale-105"
                                    aria-haspopup="true"
                                    aria-expanded={open}
                                    tabIndex={0}
                                >
                                    <img
                                        src={user.avatar}
                                        alt="User Avatar"
                                        className="w-9 h-9 rounded-full object-cover"
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm"></span>
                                </button>
                                {open && (
                                    <ul
                                        className={"absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl py-3 z-[70] border border-white/30 transition-all duration-300 ease-out transform " + (open ? 'opacity-100 translate-y-0 pointer-events-auto dropdown-animate' : 'opacity-0 -translate-y-6 pointer-events-none')}
                                    >
                                        <li>
                                            <Link
                                                to="/settings/profile"
                                                className="flex items-center gap-3 px-6 py-3 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium"
                                                onClick={() => setOpen(false)}
                                            >
                                                <svg
                                                    className="w-5 h-5 text-emerald-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle cx="12" cy="7" r="4" />
                                                    <path d="M5.5 21a8.38 8.38 0 0113 0" />
                                                </svg>
                                                Profile Settings
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/admin"
                                                className="flex items-center gap-3 px-6 py-3 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium"
                                                onClick={() => setOpen(false)}
                                            >
                                                <svg
                                                    className="w-5 h-5 text-emerald-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        d="M12 11V7m0 0V3m0 4h4m-4 0H8m8 8v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h8a2 2 0 012 2z"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                Admin Panel
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                className="w-full text-left flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                                                onClick={() => {
                                                    setShowAlert(true);
                                                    setOpen(false);
                                                }}
                                            >
                                                <svg
                                                    className="w-5 h-5 text-red-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M3 12a9 9 0 0118 0"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="nav-link-animated hidden md:flex items-center gap-2 px-4 py-3 transition-all duration-300 font-medium"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M5 12h14M12 5l7 7-7 7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="nav-text-underline">Login</span>
                            </Link>
                        )}
                        <button
                            onClick={() => {
                                console.log('Mobile menu button clicked, current open state:', open);
                                setOpen(!open);
                            }}
                            className="md:hidden text-white focus:outline-none transition-all duration-300 hover:scale-110 z-[10000] ml-2 rounded-xl p-2 bg-white/10 backdrop-blur-sm shadow-lg border border-white/20 hover:bg-white/20 relative"
                            style={{ zIndex: '10000 !important' }}
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d={
                                        open
                                            ? 'M6 18L18 6M6 6l12 12'
                                            : 'M4 8h16M4 16h16'
                                    }
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* PROFESSIONAL MOBILE NAVBAR WITH NESTED DROPDOWNS */}
                {open && createPortal(
                    <>
                        {/* Professional Backdrop with fade-in animation */}
                        <div 
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999998] md:hidden animate-fade-in"
                            onClick={() => setOpen(false)}
                            style={{ 
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                animation: 'mobileBackdropFadeIn 0.3s ease-out forwards'
                            }}
                        />
                        
                        {/* Professional Mobile Sidebar with slide-in animation */}
                        <div 
                            className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-[999999] md:hidden animate-slide-in-left"
                            style={{
                                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                                animation: 'mobileSlideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                                transform: 'translateX(-100%)'
                            }}
                        >
                            <div className="flex flex-col h-full">
                                {/* Enhanced Professional Header */}
                                <div className="relative px-6 py-2 bg-green-800 text-white overflow-hidden">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-0 left-0 w-full h-full"></div>
                                    </div>
                                    
                                    <div className="relative flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <img 
                                                    src={logo} 
                                                    alt="Farmer Connect" 
                                                    className="h-14 w-14 rounded-full border-3 border-white/30 shadow-lg object-cover"
                                                />
                                               
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold tracking-tight leading-tight">Farmer Connect</h2>
                                              
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setOpen(false)}
                                            className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Professional Navigation */}
                                <div className="flex-1 px-6 py-6 overflow-y-auto">
                                    <nav className="space-y-3">
                                        {/* Home Link */}
                                        <NavLink 
                                            to="/" 
                                            className={({ isActive }) =>
                                                `mobile-menu-item flex items-center space-x-4 py-4 px-4 rounded-xl transition-all duration-200 font-semibold ${
                                                    isActive 
                                                        ? 'bg-green-50 text-green-800 border-l-4 border-green-600 shadow-sm transform scale-[1.02]' 
                                                        : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:scale-[1.01]'
                                                }`
                                            }
                                            onClick={() => setOpen(false)}
                                        >
                                            <svg
                                                className="w-6 h-6 text-emerald-600"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span>Home</span>
                                        </NavLink>

                                        {/* Info Dropdown with Professional Styling */}
                                        <details className="mobile-menu-item group">
                                            <summary className={`flex items-center justify-between py-4 px-4 rounded-xl transition-all duration-200 font-semibold cursor-pointer list-none hover:scale-[1.01] ${
                                                infoActive 
                                                    ? 'bg-green-50 text-green-800 border-l-4 border-green-600 shadow-sm' 
                                                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                                            }`}>
                                                <div className="flex items-center space-x-4">
                                                    <svg
                                                        className={`w-6 h-6 ${infoActive ? 'text-emerald-700' : 'text-emerald-600'}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        />
                                                        <path
                                                            d="M12 16h.01M12 8a2 2 0 012 2c0 1-2 2-2 4"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span>Info</span>
                                                </div>
                                                <svg className={`w-5 h-5 transition-transform duration-300 group-open:rotate-180 ${infoActive ? 'text-emerald-700' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </summary>
                                            <div className="ml-10 mt-3 space-y-2 animate-fadeIn">
                                                <NavLink 
                                                    to="/about"
                                                    className={({ isActive }) => 
                                                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 font-medium ${
                                                            isActive 
                                                                ? 'bg-emerald-100 text-emerald-800 border-l-3 border-emerald-600 shadow-sm' 
                                                                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:translate-x-1'
                                                        }`
                                                    }
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-emerald-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            d="M13 16h-1v-4h-1m1-4h.01"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        />
                                                    </svg>
                                                    <span>About</span>
                                                </NavLink>
                                                <NavLink 
                                                    to="/contact"
                                                    className={({ isActive }) => 
                                                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 font-medium ${
                                                            isActive 
                                                                ? 'bg-emerald-100 text-emerald-800 border-l-3 border-emerald-600 shadow-sm' 
                                                                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:translate-x-1'
                                                        }`
                                                    }
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-emerald-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            d="M21 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h5.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M21 10.5l-9 6.5-9-6.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span>Contact</span>
                                                </NavLink>
                                            </div>
                                        </details>

                                        {/* Services Dropdown with Professional Styling */}
                                        <details className="mobile-menu-item group">
                                            <summary className={`flex items-center justify-between py-4 px-4 rounded-xl transition-all duration-200 font-semibold cursor-pointer list-none hover:scale-[1.01] ${
                                                servicesActive 
                                                    ? 'bg-green-50 text-green-800 border-l-4 border-green-600 shadow-sm' 
                                                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                                            }`}>
                                                <div className="flex items-center space-x-4">
                                                    <svg
                                                        className={`w-6 h-6 ${servicesActive ? 'text-emerald-700' : 'text-emerald-600'}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            d="M4 6h16M4 12h16M4 18h16"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span>Services</span>
                                                </div>
                                                <svg className={`w-5 h-5 transition-transform duration-300 group-open:rotate-180 ${servicesActive ? 'text-emerald-700' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </summary>
                                            <div className="ml-10 mt-3 space-y-2 animate-fadeIn">
                                                <NavLink 
                                                    to="/seminar"
                                                    className={({ isActive }) => 
                                                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 font-medium ${
                                                            isActive 
                                                                ? 'bg-emerald-100 text-emerald-800 border-l-3 border-emerald-600 shadow-sm' 
                                                                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:translate-x-1'
                                                        }`
                                                    }
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-emerald-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            d="M8 17l4 4 4-4m-4-5v9"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M20 12a8 8 0 10-16 0 8 8 0 0016 0z"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span>Seminar Programs</span>
                                                </NavLink>
                                                <NavLink 
                                                    to="/eic"
                                                    className={({ isActive }) => 
                                                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 font-medium ${
                                                            isActive 
                                                                ? 'bg-emerald-100 text-emerald-800 border-l-3 border-emerald-600 shadow-sm' 
                                                                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:translate-x-1'
                                                        }`
                                                    }
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-emerald-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <rect
                                                            x="4"
                                                            y="4"
                                                            width="16"
                                                            height="16"
                                                            rx="4"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        />
                                                        <path
                                                            d="M8 12h8"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span>EIC</span>
                                                </NavLink>
                                                <NavLink 
                                                    to="/distribution"
                                                    className={({ isActive }) => 
                                                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 font-medium ${
                                                            isActive 
                                                                ? 'bg-emerald-100 text-emerald-800 border-l-3 border-emerald-600 shadow-sm' 
                                                                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:translate-x-1'
                                                        }`
                                                    }
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-emerald-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            d="M3 17v-6a2 2 0 012-2h14a2 2 0 012 2v6"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M16 21v-4a2 2 0 00-2-2H10a2 2 0 00-2 2v4"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span>Distribution</span>
                                                </NavLink>
                                                <NavLink 
                                                    to="/chat-support"
                                                    className={({ isActive }) => 
                                                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 font-medium ${
                                                            isActive 
                                                                ? 'bg-emerald-100 text-emerald-800 border-l-3 border-emerald-600 shadow-sm' 
                                                                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:translate-x-1'
                                                        }`
                                                    }
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-emerald-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span>Chat Support</span>
                                                </NavLink>
                                            </div>
                                        </details>

                                        {/* Reports Link - Only show for logged in users */}
                                        {loggedIn && (
                                            <NavLink 
                                                to="/report"
                                                className={({ isActive }) =>
                                                    `mobile-menu-item flex items-center space-x-4 py-4 px-4 rounded-xl transition-all duration-200 font-semibold ${
                                                        isActive 
                                                            ? 'bg-green-50 text-green-800 border-l-4 border-green-600 shadow-sm transform scale-[1.02]' 
                                                            : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:scale-[1.01]'
                                                    }`
                                                }
                                                onClick={() => setOpen(false)}
                                            >
                                                <svg
                                                    className="w-6 h-6 text-emerald-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H4a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L12 5.586a1 1 0 00.707.293H20a2 2 0 012 2v11a2 2 0 01-2 2z"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <span>Farmer Reports</span>
                                            </NavLink>
                                        )}
                                        
                                        {/* User Authentication Section */}
                                        <div className="pt-6 mt-6 border-t border-gray-200">
                                            {loggedIn ? (
                                                <>
                                                    {/* User Profile Display */}
                                                    <div className="flex items-center space-x-4 py-4 px-4 mb-4 bg-green-50 rounded-xl">
                                                        <div className="relative">
                                                            <img 
                                                                src={user.avatar} 
                                                                alt="User" 
                                                                className="w-12 h-12 rounded-full border-2 border-emerald-200 object-cover"
                                                            />
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{user.name}</p>
                                                            <p className="text-sm text-emerald-600">Active Member</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Profile Settings Link */}
                                                    <NavLink 
                                                        to="/settings/profile"
                                                        className={({ isActive }) =>
                                                            `mobile-menu-item flex items-center space-x-4 py-3 px-4 mb-3 rounded-xl transition-all duration-200 font-medium ${
                                                                isActive 
                                                                    ? 'bg-emerald-100 text-emerald-800 border-l-3 border-emerald-600 shadow-sm' 
                                                                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                                                            }`
                                                        }
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <svg
                                                            className="w-5 h-5 text-emerald-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle cx="12" cy="7" r="4" />
                                                            <path d="M5.5 21a8.38 8.38 0 0113 0" />
                                                        </svg>
                                                        <span>Profile Settings</span>
                                                    </NavLink>
                                                    
                                                    {/* Admin Panel Link */}
                                                    <NavLink 
                                                        to="/admin"
                                                        className={({ isActive }) =>
                                                            `mobile-menu-item flex items-center space-x-4 py-3 px-4 mb-3 rounded-xl transition-all duration-200 font-medium ${
                                                                isActive 
                                                                    ? 'bg-emerald-100 text-emerald-800 border-l-3 border-emerald-600 shadow-sm' 
                                                                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                                                            }`
                                                        }
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <svg
                                                            className="w-5 h-5 text-emerald-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                d="M12 11V7m0 0V3m0 4h4m-4 0H8m8 8v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h8a2 2 0 012 2z"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        <span>Admin Panel</span>
                                                    </NavLink>
                                                    
                                                    {/* Professional Logout Button */}
                                                    <button 
                                                        onClick={() => {
                                                            setShowAlert(true);
                                                            setOpen(false);
                                                        }}
                                                        className="mobile-menu-item flex items-center justify-center space-x-3 py-4 px-4 rounded-xl transition-all duration-200 font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 w-full"
                                                    >
                                                        <svg
                                                            className="w-5 h-5 text-white"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                d="M17 16l4-4m0 0l-4-4m4 4H7"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M3 12a9 9 0 0118 0"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        <span>Logout</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Anonymous User Message */}
                                                    <div className="flex items-center space-x-4 py-4 px-4 mb-4 bg-gray-50 rounded-xl border border-gray-200">
                                                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-700">Guest User</p>
                                                            <p className="text-sm text-gray-500">Please login to access all features</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Professional Login Button */}
                                                    <NavLink 
                                                        to="/login"
                                                        className="mobile-menu-item flex items-center justify-center space-x-4 py-4 px-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <svg
                                                            className="w-5 h-5 text-white"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                d="M5 12h14M12 5l7 7-7 7"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        <span>Login to Get Started</span>
                                                    </NavLink>
                                                    
                                                    {/* Sign Up Option */}
                                                    <NavLink 
                                                        to="/register"
                                                        className="flex items-center justify-center space-x-4 py-3 px-6 mt-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-300"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <svg
                                                            className="w-5 h-5 text-gray-600"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        <span>Create Account</span>
                                                    </NavLink>
                                                </>
                                            )}
                                        </div>
                                    </nav>
                                </div>
                                
                                {/* Professional Footer */}
                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                    <p className="text-xs text-gray-500 text-center font-medium">
                                        © 2025 Farmer Connect. Agricultural Excellence.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Add custom CSS for animations */}
                            <style jsx>{`
                                @keyframes fadeIn {
                                    from { opacity: 0; transform: translateY(-10px); }
                                    to { opacity: 1; transform: translateY(0); }
                                }
                                .animate-fadeIn {
                                    animation: fadeIn 0.3s ease-out;
                                }
                            `}</style>
                        </div>
                    </>,
                    document.body
                )}
            </nav>
        </>
    );
}
