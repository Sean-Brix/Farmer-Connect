import React, { useEffect, useState, useRef } from 'react';
import logo from '../../../Assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import default_picture from '../../../Assets/default_picture.png';

// SERVICES
import Analytics from '../../Services/Analytics/Analytics';
import Profiles from '../../Services/Profiles/Profiles.jsx';
import Seminar from '../../Services/Seminar/Seminar.jsx';
import EIC from '../../Services/EIC/EIC.jsx';
import Content from '../../Services/Content/Content.jsx';
import Distribution from '../../Services/Distribution/Distribution.jsx';

// GLOBAL
import AccountProfile from '../../../Components/settings/AccountProfile/AccountProfile.jsx';

// SUB COMPONENT
import Sidebar from './sub/Sidebar.jsx';
import Audit from '../../Services/Logs/Audit.jsx';

export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();


  // User Account Details
  const [details, setDetails] = useState({
    username: "Guest Account", 
    position: "User Admin",
    picture: default_picture
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
    settings: () => Settings,

    // GLOBAL
    account: ()=> AccountProfile,
  });

  const [Page, setPage] = useState(elements.current.analytics); // [ analytics, enrollment, profiles, eic, settings, audit, survey, content, distribution ]
  const admin_navigate = (page)=>{
    setPage(elements.current[page]);
  }

  //Initial Request on Mount
  useEffect(()=>{

    (async()=>{

        try {
          // Get Account Details
          const response = await fetch("/api/accounts/details");
          const data = (await response.json()).payload;

          console.log(data)
          if (!response.ok) {
            throw new Error(data.error);
          }
          if(data.access === "User"){
            throw new Error(data.error);
          }

          // Get Profile Picture
          const profile = await fetch("/api/accounts/getProfile");
          let image_url;

          if (profile.ok && profile.headers.get('content-type').includes('image')) {
            const blob = await profile.blob();
            image_url = URL.createObjectURL(blob);
          } else {
            image_url = default_picture;
          }

          // Render State
          setDetails({
            username: data.username,
            position: data.position,
            picture: image_url,
            setProfile: setDetails,
            id: data.id,
            access: data.access
          });

        } catch (err) {
          // Prevent multiple 401 containers and listeners
          if (document.getElementById('unauthorized-401-container')) return;

          const container = document.createElement('div');
          container.id = 'unauthorized-401-container';
          container.style.position = 'fixed';
          container.style.top = '0';
          container.style.left = '0';
          container.style.width = '100vw';
          container.style.height = '100vh';
          container.style.background = 'linear-gradient(135deg, #2563eb 0%, #1e293b 100%)';
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

    })()


  }, []);


  // Switch Between Logout and Login
  const logging = async()=>{

    
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
      await fetch('/api/authentication/logout');
      return navigate('/login');
    }

  }

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
      <div className="flex min-h-screen h-screen bg-gray-50">
        {/* DESKTOP SIDEBAR */}
        <Sidebar
          logging={logging}
          details={details}
          setPage={setPage}
          elements={elements}
          currentPageKey={currentPageKey}
          handleSetPage={handleSetPage}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen h-screen ml-0 transition-all dashboard-main-content">
          <header className="bg-white/80 backdrop-blur-md shadow-sm px-4 flex justify-between md:justify-center items-center w-full fixed top-0 left-0 z-20 dashboard-header h-16 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-9 w-9 rounded-full shadow-sm" />
              <h1
                className="text-base md:text-lg font-semibold text-gray-800 tracking-tight cursor-pointer"
                onClick={() => navigate('/')}
                style={{ userSelect: 'none' }}
              >
                FITS Tanza - Municipal Agriculture Office
              </h1>
            </div>
            <button
              className="md:hidden text-gray-600 hover:text-blue-600 transition ml-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
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
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </header>
          {/* Render children below the header */}
          <main className="flex-1 p-2 sm:p-6 overflow-auto pt-20 h-0 min-h-0 minimalist-scrollbar bg-white/70">
            <Page admin_navigate={admin_navigate} details={details} />
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
      <aside
        className={`fixed inset-y-0 left-0 bg-white/95 backdrop-blur-md border-r border-gray-200 w-64 z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden flex flex-col h-screen max-h-screen shadow-lg`}
        id="mobile-menu"
      >
        <div className="flex flex-col h-full max-h-screen">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 pl-2">Dashboard</h1>
            <button
              className="text-gray-500 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            <nav className="mt-2 flex-1 overflow-y-auto minimalist-scrollbar">
              <ul className="space-y-1 px-2 max-h-[70vh] overflow-y-auto">
                {/* Analytics */}
                <li
                  className={`flex items-center gap-3 p-3 text-base hover:bg-gray-100 rounded-lg transition cursor-pointer w-full h-12 min-h-[3rem] ${
                    currentPageKey === 'analytics' ? 'bg-gray-200 font-semibold text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    handleSetPage('analytics');
                    setMobileMenuOpen(false);
                  }}
                  style={{ minHeight: '3rem' }}
                >
                  <span>
                    <i className="fas fa-chart-line h-5 w-5"></i>
                  </span>
                  <span>Analytics</span>
                </li>
                {/* User Profiles */}
                <li
                  className={`flex items-center gap-3 p-3 text-base hover:bg-gray-100 rounded-lg transition cursor-pointer w-full h-12 min-h-[3rem] ${
                    currentPageKey === 'profiles' ? 'bg-gray-200 font-semibold text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    handleSetPage('profiles');
                    setMobileMenuOpen(false);
                  }}
                  style={{ minHeight: '3rem' }}
                >
                  <span>
                    <i className="fas fa-user-circle h-5 w-5"></i>
                  </span>
                  <span>User Profiles</span>
                </li>
                {/* Seminar Programs */}
                <li
                  className={`flex items-center gap-3 p-3 text-base hover:bg-gray-100 rounded-lg transition cursor-pointer w-full h-12 min-h-[3rem] ${
                    currentPageKey === 'enrollment' ? 'bg-gray-200 font-semibold text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    handleSetPage('enrollment');
                    setMobileMenuOpen(false);
                  }}
                  style={{ minHeight: '3rem' }}
                >
                  <span>
                    <i className="fas fa-user-plus h-5 w-5"></i>
                  </span>
                  <span>Seminar Programs</span>
                </li>
                {/* EIC */}
                <li
                  className={`flex items-center gap-3 p-3 text-base hover:bg-gray-100 rounded-lg transition cursor-pointer w-full h-12 min-h-[3rem] ${
                    currentPageKey === 'eic' ? 'bg-gray-200 font-semibold text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    handleSetPage('eic');
                    setMobileMenuOpen(false);
                  }}
                  style={{ minHeight: '3rem' }}
                >
                  <span>
                    <i className="fas fa-id-card h-5 w-5"></i>
                  </span>
                  <span>EIC - Item Panel</span>
                </li>
                {/* Distribution */}
                <li
                  className={`flex items-center gap-3 p-3 text-base hover:bg-gray-100 rounded-lg transition cursor-pointer w-full h-12 min-h-[3rem] ${
                    currentPageKey === 'distribution' ? 'bg-gray-200 font-semibold text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    handleSetPage('distribution');
                    setMobileMenuOpen(false);
                  }}
                  style={{ minHeight: '3rem' }}
                >
                  <span>
                    <i className="fas fa-box-open h-5 w-5"></i>
                  </span>
                  <span>Distributions</span>
                </li>
                {/* Content Management */}
                <li
                  className={`flex items-center gap-3 p-3 text-base hover:bg-gray-100 rounded-lg transition cursor-pointer w-full h-12 min-h-[3rem] ${
                    currentPageKey === 'content' ? 'bg-gray-200 font-semibold text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    handleSetPage('content');
                    setMobileMenuOpen(false);
                  }}
                  style={{ minHeight: '3rem' }}
                >
                  <span>
                    <i className="fas fa-archive h-5 w-5"></i>
                  </span>
                  <span>Inventory</span>
                </li>
                {/* Audit */}
                <li
                  className={`flex items-center gap-3 p-3 text-base hover:bg-gray-100 rounded-lg transition cursor-pointer w-full h-12 min-h-[3rem] ${
                    currentPageKey === 'audit' ? 'bg-gray-200 font-semibold text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    handleSetPage('audit');
                    setMobileMenuOpen(false);
                  }}
                  style={{ minHeight: '3rem' }}
                >
                  <span>
                    <i className="fas fa-clipboard-list h-5 w-5"></i>
                  </span>
                  <span>Logs / Audit Trail</span>
                </li>
                {/* Survey */}
                <li
                  className={`flex items-center gap-3 p-3 text-base hover:bg-gray-100 rounded-lg transition cursor-pointer w-full h-12 min-h-[3rem] ${
                    currentPageKey === 'survey' ? 'bg-gray-200 font-semibold text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    handleSetPage('survey');
                    setMobileMenuOpen(false);
                  }}
                  style={{ minHeight: '3rem' }}
                >
                  <span>
                    <i className="fas fa-poll h-5 w-5"></i>
                  </span>
                  <span>Survey Forms</span>
                </li>
                {/* Settings */}
                <li
                  className={`flex items-center gap-3 p-3 text-base hover:bg-gray-100 rounded-lg transition cursor-pointer w-full h-12 min-h-[3rem] ${
                    currentPageKey === 'settings' ? 'bg-gray-200 font-semibold text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    handleSetPage('settings');
                    setMobileMenuOpen(false);
                  }}
                  style={{ minHeight: '3rem' }}
                >
                  <span>
                    <i className="fas fa-cog h-5 w-5"></i>
                  </span>
                  <span>Settings</span>
                </li>
              </ul>
            </nav>
            {/* Profile and Logout at the bottom, styled like desktop */}
            <div className="p-4 border-t border-gray-200 flex flex-col items-center mt-auto bg-white/80">
              <div
                className="flex items-center mb-4 w-full gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition sidebar-profile"
                onClick={() => {
                  setPage(elements.current["account"]);
                }}
              >
                <div className="relative rounded-full border-2 border-blue-100 shadow-sm sidebar-profile-picture">
                  <img
                    src={details.picture}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col sidebar-profile-info">
                  <span className="font-semibold text-gray-800">{details.username}</span>
                  <span className="text-xs text-gray-500">{details.position}</span>
                </div>
              </div>
              {/* Logout button (mobile sidebar, bottom) */}
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700 w-full border border-gray-200 font-semibold"
                onClick={logging}
              >
                <span>
                  <i className="fas fa-sign-out-alt h-5 w-5"></i>
                </span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Minimalist scrollbar utility and sidebar icon-only mode */}
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
          min-height: 3rem !important;
          height: 3rem !important;
          width: 100% !important;
          box-sizing: border-box;
        }
        #mobile-menu li > .flex {
          min-height: 3rem !important;
          height: 3rem !important;
          align-items: center !important;
        }
      `}</style>
    </>
  );
}
