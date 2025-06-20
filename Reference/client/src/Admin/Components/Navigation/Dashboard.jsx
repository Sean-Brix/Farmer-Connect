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
    analytics: ()=>Analytics,
    profiles: ()=>Profiles,
    enrollment: ()=>Seminar,
    eic: ()=> EIC,
    content: ()=> Content,
    distribution: ()=> Distribution,

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
      <div className="flex min-h-screen h-screen">
        {/* DESKTOP SIDEBAR */}
        <Sidebar
          logging={logging}
          details={details}
          setPage={setPage}
          elements={elements}
          iconOnlyClass="sidebar-icon-only"
          currentPageKey={currentPageKey}
          handleSetPage={handleSetPage}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen h-screen ml-0 md:ml-64 transition-all">
          <header className="gradient-bg shadow-md drop-shadow-lg p-3 flex justify-evenly md:justify-center md:px-8 items-center w-full fixed top-0 left-0 z-20 md:left-64 md:w-[calc(100%-16rem)] ">
            <div className="flex items-center space-x-4 justify-center">
              <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
              <h1 className="text-lg font-semibold text text-center items-center family">
                FITS Tanza - Municipal Agriculture Office
              </h1>
              <button
                className="md:hidden text mt-2 md:mt-0 translate-y-[-4px] ml-4"
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
            </div>
          </header>
          {/* Render children below the header */}
          <main className="flex-1 p-2 sm:p-4 overflow-auto pt-20 h-0 min-h-0 minimalist-scrollbar">
            <Page admin_navigate={admin_navigate} details={details} />
          </main>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu overlay"
        />
      )}
      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 gradient-bg text-white drop-shadow-lg shadow-lg w-64 z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden flex flex-col h-screen max-h-screen`}
        id="mobile-menu"
      >
        <div className="flex flex-col h-full max-h-screen">
          <div className="p-4 border-b border-blue-500 flex justify-between items-center">
            <h1 className="text-2xl font-bold family">Dashboard</h1>
            <button
              className="text-white"
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
              <ul className="space-y-2 px-2 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
                {/* Home */}
                <li
                  className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                    currentPageKey === 'home' ? 'bg-blue-800 text-white font-bold' : ''
                  }`}
                  onClick={() => {
                    setCurrentPageKey('home');
                    setMobileMenuOpen(false);
                    window.location.href = '/';
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <span>
                      {/* Modern home icon (Material Design style) */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10.707 2.293a1 1 0 0 1 1.414 0l8 8A1 1 0 0 1 19.707 11H19v8a2 2 0 0 1-2 2h-2a1 1 0 0 1-1-1v-4h-2v4a1 1 0 0 1-1 1h-2a2 2 0 0 1-2-2v-8h-.707a1 1 0 0 1-.707-1.707l8-8z"/>
                      </svg>
                    </span>
                    <span>Home</span>
                  </div>
                </li>
                {/* Analytics */}
                <li
                  className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                    currentPageKey === 'analytics' ? 'bg-blue-800 text-white font-bold' : ''
                  }`}
                  onClick={() => {
                    handleSetPage('analytics');
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <span>
                      <i className="fas fa-cog h-6 w-6"></i>
                    </span>
                    <span>Analytics</span>
                  </div>
                </li>
                {/* User Profiles */}
                <li
                  className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                    currentPageKey === 'profiles' ? 'bg-blue-800 text-white font-bold' : ''
                  }`}
                  onClick={() => {
                    handleSetPage('profiles');
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <span>
                      <i className="fas fa-user-circle h-6 w-6"></i>
                    </span>
                    <span>User Profiles</span>
                  </div>
                </li>
                {/* Seminar Programs */}
                <li
                  className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                    currentPageKey === 'enrollment' ? 'bg-blue-800 text-white font-bold' : ''
                  }`}
                  onClick={() => {
                    handleSetPage('enrollment');
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <span>
                      <i className="fas fa-user-plus h-6 w-6"></i>
                    </span>
                    <span>Seminar Programs</span>
                  </div>
                </li>
                {/* EIC */}
                <li
                  className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                    currentPageKey === 'eic' ? 'bg-blue-800 text-white font-bold' : ''
                  }`}
                  onClick={() => {
                    handleSetPage('eic');
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <span>
                      <i className="fas fa-id-card h-6 w-6"></i>
                    </span>
                    <span>EIC - Item Panel</span>
                  </div>
                </li>
                {/* DOSTRIBUTION */}
                <li
                  className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                    currentPageKey === 'distribution' ? 'bg-blue-800 text-white font-bold' : ''
                  }`}
                  onClick={() => {
                    handleSetPage('distribution');
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <span>
                      <i className="fas fa-id-card h-6 w-6"></i>
                    </span>
                    <span>Distributions</span>
                  </div>
                </li>
                {/* Content Management */}
                <li
                  className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                    currentPageKey === 'content' ? 'bg-blue-800 text-white font-bold' : ''
                  }`}
                  onClick={() => {
                    handleSetPage('content');
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <span>
                      <i className="fas fa-home h-6 w-6"></i>
                    </span>
                    <span>Inventory</span>
                  </div>
                </li>
                {/* Audit */}
                <li
                  className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                    currentPageKey === 'audit' ? 'bg-blue-800 text-white font-bold' : ''
                  }`}
                  onClick={() => {
                    handleSetPage('audit');
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <span>
                      <i className="fas fa-id-card h-6 w-6"></i>
                    </span>
                    <span>Logs / Audit Trail</span>
                  </div>
                </li>
                {/* Survey */}
                <li
                  className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                    currentPageKey === 'survey' ? 'bg-blue-800 text-white font-bold' : ''
                  }`}
                  onClick={() => {
                    handleSetPage('survey');
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <span>
                      <i className="fas fa-home h-6 w-6"></i>
                    </span>
                    <span>Survey Forms</span>
                  </div>
                </li>
                {/* Settings */}
                <li
                  className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                    currentPageKey === 'settings' ? 'bg-blue-800 text-white font-bold' : ''
                  }`}
                  onClick={() => {
                    handleSetPage('settings');
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <span>
                      <i className="fas fa-cog h-6 w-6"></i>
                    </span>
                    <span>Settings</span>
                  </div>
                </li>
              </ul>
            </nav>
            {/* Profile and Logout at the bottom, styled like desktop */}
                  <div className="p-4 border-t logout flex flex-col items-center mt-auto bg-gradient-to-t from-blue-900/80 via-blue-900/60 to-transparent">
                    <div
                    className="flex items-start mb-4 w-full justify-evenly neon-profile-hover cursor-pointer"
                    onClick={() => {
                      setPage(elements.current["account"]);
                      // Don't mutate props directly
                    }}
                    >
                    <div className="relative rounded-full border-3 border-blue-800 neon-avatar">
                      <img 
                      src={details.picture} 
                      alt="Profile" 
                      className="h-10 w-10 rounded-full border-2 border-white object-cover" 
                      />
                      <span className="neon-border"></span>
                    </div>
                    <div className="flex-col flex flex-start">
                      <span className="font-bold">{ details.username }</span>
                      <span className="text-sm text-gray-300">{ details.position }</span>
                    </div>
                    </div>
                    {/* Logout button (mobile sidebar, bottom) */}
              <button 
                className="flex items-center justify-center space-x-2 px-4 py-2 element hover:element rounded-lg transition text w-full border"
                onClick={logging}
              >
                <span className="flex items-center py-2k">
                  <i className="fas fa-sign-out-alt h-5 w-5 translate-y-1"></i>
                </span>
                <span className="font-bold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Minimalist scrollbar utility, neon profile effect, and sidebar icon-only mode */}
      <style>{`
        .minimalist-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        .minimalist-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .minimalist-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        html, body, #root {
          height: 100%;
        }
      
      
        /* Sidebar icon-only mode for 1000px-1300px */
        @media (max-width: 1300px) and (min-width: 1000px) {
          .sidebar-icon-only {
            width: 5rem !important;
            min-width: 5rem !important;
            max-width: 5rem !important;
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
      `}</style>
    </>
  );
}
