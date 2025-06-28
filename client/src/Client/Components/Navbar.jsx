import React, { useState } from 'react';
import { Router } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../../Assets/Logo.png';
import Chat from '../../Components/Chats/Chat';
export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    // Dummy user data (replace with real user data as needed)
    const user = {
       
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=1e40af&color=fff',
    };
    const [infoOpen, setInfoOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Simulate authentication state (replace with real auth logic)
    const isLoggedIn = !!user; // true if user object exists

    // Helper to determine if we are in the "mid" screen size (750px - 1050px)
    const [isMidScreen, setIsMidScreen] = useState(false);

    React.useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            setIsMidScreen(width >= 750 && width <= 1050);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Add a state to simulate logout
    const [loggedIn, setLoggedIn] = useState(isLoggedIn);
    const [showAlert, setShowAlert] = useState(false);

    // Helper for logout
    const handleLogout = (navigate) => {
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
        if (navigate) navigate('/login');
    };

    // For navigation in logout (for both desktop and mobile)
    const navigate = (to) => {
        window.location.href = to;
    };

    // Scroll to top on route change and on refresh
    React.useEffect(() => {
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
    

    return (
        <>
            <Chat />
            {showAlert && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center  bg-black/70 transition-all duration-300">
                    <div
                        id="logout-alert"
                        className="bg-white rounded-2xl shadow-xl px-7 py-7 flex flex-col items-center gap-5 border border-blue-100 transition-all duration-500 animate-fade-in-up"
                        style={{ minWidth: 220, maxWidth: 300 }}
                    >
                        <svg
                            className="w-8 h-8 text-blue-500 animate-bounce"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="#3b82f6"
                                strokeWidth="2.2"
                                fill="#eff6ff"
                            />
                            <path
                                d="M12 16h.01M12 8a2 2 0 012 2c0 1-2 2-2 4"
                                stroke="#2563eb"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-base font-semibold text-blue-700 text-center">Logout?</span>
                        <span className="block text-gray-500 text-sm text-center">You will need to login again.</span>
                        <div className="flex gap-2 mt-1">
                            <button
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onClick={() => {
                                    setShowAlert(false);
                                    setTimeout(() => {
                                        setLoggedIn(false);
                                        setOpen(false);
                                        navigate('/login');
                                    }, 200);
                                }}
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
            <nav className="bg-white shadow-lg fixed w-full rounded-b-4xl z-30 top-0 left-0">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-2 md:px-8 py-6">
                    <img
                        src={logo}
                        alt="FITS -Tanza Logo"
                        className="w-10 h-10 object-contain ml-4"
                    />
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-extrabold text-2xl px-2 text-blue-700 md:text-2xl"
                    >
                        FITS -Tanza
                    </Link>
                    <div className="flex-1 flex justify-center">
                        <ul className="hidden md:flex items-center gap-2 lg:gap-6">
                            <li>
                                <Link
                                    to="/"
                                    className="flex items-center gap-2 text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-lg font-semibold transition"
                                >
                                    <svg
                                        className="w-5 h-5 text-blue-500"
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
                                    {!isMidScreen && 'Home'}
                                </Link>
                            </li>
                            <li className="relative group">
                                <button
                                    type="button"
                                    onClick={() => setInfoOpen(!infoOpen)}
                                    onBlur={() =>
                                        setTimeout(() => setInfoOpen(false), 150)
                                    }
                                    className="flex items-center gap-2 text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-lg font-semibold transition focus:outline-none"
                                >
                                    <svg
                                        className="w-5 h-5 text-blue-500"
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
                                    {!isMidScreen && 'Info'}
                                    <svg
                                        className={`w-4 h-4 ml-1 transition-transform duration-200 ${
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
                                    className={`absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-lg py-2 z-40 border border-blue-100 transition-all duration-200 ${
                                        infoOpen
                                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                                            : 'opacity-0 -translate-y-2 pointer-events-none'
                                    }`}
                                >
                                    <li>
                                        <Link
                                            to="/about"
                                            className="flex items-center gap-2 px-6 py-3 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                        >
                                            <svg
                                                className="w-5 h-5 text-blue-500"
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
                                            {'About'}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/contact"
                                            className="flex items-center gap-2 px-6 py-3 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                        >
                                            <svg
                                                className="w-5 h-5 text-blue-500"
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
                                            {'Contact'}
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative group">
                                <button
                                    type="button"
                                    onClick={() => setServicesOpen(!servicesOpen)}
                                    onBlur={() =>
                                        setTimeout(
                                            () => setServicesOpen(false),
                                            150
                                        )
                                    }
                                    className="flex items-center gap-2 text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-lg font-semibold transition focus:outline-none"
                                >
                                    <svg
                                        className="w-5 h-5 text-blue-500"
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
                                    {!isMidScreen && 'Services'}
                                    <svg
                                        className={`w-4 h-4 ml-1 transition-transform duration-200 ${
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
                                    className={`absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-4 z-40 border border-blue-100 transition-all duration-200 ${
                                        servicesOpen
                                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                                            : 'opacity-0 -translate-y-2 pointer-events-none'
                                    }`}
                                >
                                    <li>
                                        <Link
                                            to="/seminar"
                                            className="flex items-center gap-3 px-6 py-3 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                        >
                                            <svg
                                                className="w-5 h-5 text-blue-500"
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
                                            {'Seminar Programs'}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/eic"
                                            className="flex items-center gap-3 px-6 py-3 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                        >
                                            <svg
                                                className="w-5 h-5 text-blue-500"
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
                                            {'EIC'}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/distribution"
                                            className="flex items-center gap-3 px-6 py-3 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                        >
                                            <svg
                                                className="w-5 h-5 text-blue-500"
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
                                            {'Distribution'}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/survey"
                                            className="flex items-center gap-3 px-6 py-3 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                        >
                                            <svg
                                                className="w-5 h-5 text-blue-500"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <rect
                                                    x="3"
                                                    y="4"
                                                    width="18"
                                                    height="16"
                                                    rx="2"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                />
                                                <path
                                                    d="M8 10h8M8 14h6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            {'Survey'}
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link
                                    to="/settings/profile"
                                    className="flex items-center gap-2 text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-lg font-semibold transition"
                                >
                                    <svg
                                        className="w-5 h-5 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="12" cy="7" r="4" />
                                        <path d="M5.5 21a8.38 8.38 0 0113 0" />
                                    </svg>
                                    {!isMidScreen && 'Profile Settings'}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setOpen((open) => !open)}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 to-blue-400 hover:from-blue-800 hover:to-blue-500 transition-all duration-200 focus:outline-none shadow-lg border border-blue-100"
                                aria-haspopup="true"
                                aria-expanded={open}
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="7" r="4" />
                                    <path d="M5.5 21a8.38 8.38 0 0113 0" />
                                </svg>
                            </button>
                            {open && (
                                <ul
                                    className="absolute right-0 mt-3 w-44 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-blue-100 animate-fade-in"
                                    onMouseLeave={() => setOpen(false)}
                                >
                                    {loggedIn ? (
                                        <>
                                            <li>
                                                <button
                                                    className="w-full text-left flex items-center gap-2 px-5 py-3 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                                    onClick={() => {
                                                        setShowAlert(true);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-blue-500"
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
                                            
                                                <li>
                                                    <Link
                                                        to="/admin"
                                                        className="flex items-center gap-2 px-5 py-3 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <svg
                                                            className="w-5 h-5 text-blue-500"
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
                                            
                                        </>
                                    ) : (
                                        <li>
                                            <Link
                                                to="/login"
                                                className="flex items-center gap-2 px-5 py-3 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                                onClick={() => setOpen(false)}
                                            >
                                                <svg
                                                    className="w-5 h-5 text-blue-500"
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
                                                Login
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                        <button
                            onClick={() => setOpen(!open)}
                            className="md:hidden text-blue-700 focus:outline-none transition-transform hover:scale-110 z-50 ml-2 rounded-full p-1 bg-white/80 shadow border border-blue-100"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
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
                <div
                    className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-40 transform transition-transform duration-300 ${
                        open ? 'translate-x-0' : '-translate-x-full'
                    } md:hidden`}
                    style={{
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    <style>
                        {`
                            .hide-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                            @keyframes fade-in-up {
                                0% { opacity: 0; transform: translateY(20px);}
                                100% { opacity: 1; transform: translateY(0);}
                            }
                            .animate-fade-in-up {
                                animation: fade-in-up 0.4s cubic-bezier(.4,0,.2,1);
                            }
                        `}
                    </style>
                    <div className="hide-scrollbar flex flex-col h-full">
                        <div className="flex items-center justify-between px-6 py-8 border-b border-blue-100">
                            <img
                                src={logo}
                                alt="FITS -Tanza Logo"
                                className="w-10 h-10 object-contain "
                            />
                            <Link
                                to="/"
                                className="flex items-center font-extrabold text-2xl px-2 mr-10  text-blue-700 md:text-2xl"
                            >
                                FITS -Tanza
                            </Link>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-blue-700 focus:outline-none"
                                aria-label="Close menu"
                            >
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col items-center gap-4 py-10 border-b border-blue-100 bg-gradient-to-b from-blue-50 to-white">
                            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-blue-700 to-blue-400 shadow-lg">
                                <svg
                                    className="w-12 h-12 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="7" r="4" />
                                    <path d="M5.5 21a8.38 8.38 0 0113 0" />
                                </svg>
                                {loggedIn && (
                                    <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            {loggedIn ? (
                                <>
                                    <span className="font-semibold text-blue-800 text-lg">
                                        {user.name}
                                    </span>
                                    <button
                                        className="mt-2 flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-200"
                                        onClick={() => {
                                            setShowAlert(true);
                                            setOpen(false);
                                        }}
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
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-8 py-3 bg-blue-700 text-white hover:bg-blue-800 font-bold rounded-full shadow-lg transition"
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
                                    Login
                                </Link>
                            )}
                        </div>
                        <ul className="flex flex-col gap-2 px-8 py-8">
                            <li>
                                <Link
                                    to="/"
                                    className="flex items-center gap-2 px-6 py-6 text-blue-700 hover:bg-blue-50 font-semibold rounded-lg transition"
                                >
                                    <svg
                                        className="w-5 h-5 text-blue-500"
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
                                    Home
                                </Link>
                            </li>
                            <li>
                                <details className="group">
                                    <summary className="flex items-center gap-2 px-6 py-6 text-blue-700 hover:bg-blue-50 font-semibold rounded-lg cursor-pointer transition focus:outline-none">
                                        <svg
                                            className="w-5 h-5 text-blue-500"
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
                                        Info
                                        <svg
                                            className="w-4 h-4 ml-1 transition-transform duration-200 group-open:rotate-180"
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
                                    </summary>
                                    <ul className="bg-white rounded-xl shadow-lg py-2 mt-2 border border-blue-100">
                                        <li>
                                            <Link
                                                to="/about"
                                                className="flex items-center gap-2 px-8 py-3 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-blue-500"
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
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/contact"
                                                className="flex items-center gap-2 px-8 py-3 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-blue-500"
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
                                            </Link>
                                        </li>
                                    </ul>
                                </details>
                            </li>
                            <li>
                                <details className="group">
                                    <summary className="flex items-center gap-2 px-6 py-6 text-blue-700 hover:bg-blue-50 font-semibold rounded-lg cursor-pointer transition focus:outline-none">
                                        <svg
                                            className="w-5 h-5 text-blue-500"
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
                                        Services
                                        <svg
                                            className="w-4 h-4 ml-1 transition-transform duration-200 group-open:rotate-180"
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
                                    </summary>
                                    <ul className="bg-white rounded-xl shadow-lg py-4 mt-2 border border-blue-100">
                                        <li>
                                            <Link
                                                to="/seminar"
                                                className="flex items-center gap-3 px-8 py-4 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-blue-500"
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
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/eic"
                                                className="flex items-center gap-3 px-8 py-4 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-blue-500"
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
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/distribution"
                                                className="flex items-center gap-3 px-8 py-4 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-blue-500"
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
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/survey"
                                                className="flex items-center gap-3 px-8 py-4 text-blue-700 hover:bg-blue-50 rounded-lg transition font-medium"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-blue-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <rect
                                                        x="3"
                                                        y="4"
                                                        width="18"
                                                        height="16"
                                                        rx="2"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    />
                                                    <path
                                                        d="M8 10h8M8 14h6"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                Survey
                                            </Link>
                                        </li>
                                    </ul>
                                </details>
                            </li>
                            <li>
                                <Link
                                    to="/settings/profile"
                                    className="flex items-center gap-2 px-6 py-6 text-blue-700 hover:bg-blue-50 font-semibold rounded-lg transition"
                                >
                                    <svg
                                        className="w-5 h-5 text-blue-500"
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
                        </ul>
                    </div>
                </div>
                {open && (
                    <div
                        className="fixed inset-0 bg-gray-500 opacity-60 backdrop-blur-2xl z-30 md:hidden"
                        onClick={() => setOpen(false)}
                    />
                )}
            </nav>
        </>
    );
}
