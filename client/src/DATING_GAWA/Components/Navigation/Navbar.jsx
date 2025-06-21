import React, { useEffect, useState } from 'react';
import logo from '../../Assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import '../../index.css';
import me from '../../Services/Profile/Assets/me.png';

export default function Navbar({children}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  // Login/Logout Button
  const [logButton, setLogButton] = useState("Login Now");

  // User Account Details
  const [details, setDetails] = useState({
          username: "Guest Account", 
          position: "User Client",
          picture: ""
      });
  

  // Initial Request on Mount
  useEffect(()=>{

      (async()=>{

          const response = await fetch("/api/accounts/details");
          const data = (await response.json()).payload;

          if(!response.ok){
              setDetails({
                  username: "Guest Account", 
                  position: "User Client",
                  picture: ""
              });
              return;
          }

          setDetails({
              username: data.username, 
              position: data.position,
              picture: ""
          });

      })()

  }, []);

  // Change the button
  useEffect(()=>{

    if(details.username === "Guest Account") return;
    setLogButton("Logout");

  }, [details])

  // Switch Between Logout and Login
  const logging = async()=>{

    if(details.username === "Guest Account"){
      return navigate('/login');
    } 

    if(confirm("Are you sure you want to logout?")) {

      await fetch('/api/authentication/logout');
      setLogButton("Login Now");

      setDetails({
          username: "Guest Account", 
          position: "User Client",
          picture: ""
      })

    }

  }

  return (
    <>
      <div className="flex h-screen">

        {/* Sidebar for desktop */}
        <aside className="w-64 gradient-bg text shadow-md  hidden md:flex flex-col justify-between h-screen fixed left-0 top-0 z-30">
          <div className="flex flex-col flex-1 justify-between h-full">
            <div>
              <div className="p-4 border-b border-blue-500">
                <h1 className="text-xl font-semibold ml-7 family">FITS - Tanza</h1>
              </div>
              <nav className="mt-4">
                <ul className="space-y-4">

                  {/* Home Link */}
                  <li className="p-6 hover:bg-blue-700 rounded-lg transition">
                    <Link to="/" className="flex items-center space-x-3">
                      <span>
                        <i className="fas fa-home h-5 w-5"></i>
                      </span>
                      <span >Home</span>
                    </Link>
                  </li>

                  {/* Analytics Link */}
                  <li className="p-6 hover:bg-blue-700 rounded-lg transition">
                    <Link to="/profiles" className="flex items-center space-x-3">
                      <span>
                        <i className="fas fa-user-circle h-5 w-5"></i>
                      </span>
                      <span>Profile</span>
                    </Link>
                  </li>

                  {/* Enrollment Link */}
                  <li className="p-6 hover:bg-blue-700 rounded-lg transition">
                    <Link to="/enrollment" className="flex items-center space-x-3">
                      <span>
                        <i className="fas fa-user-plus h-5 w-5"></i>
                      </span>
                      <span>Enrollment</span>
                    </Link>
                  </li>
                  
                  {/* Profile Link */}
                  <li className="p-6 hover:bg-blue-700 rounded-lg transition">
                    <Link to="/EIC" className="flex items-center space-x-3">
                      <span>
                        <i className="fas fa-id-card h-5 w-5"></i>
                      </span>
                      <span>EIC</span>
                    </Link>
                  </li>

                  {/* Settings Link */}
                  <li className="p-6 hover:bg-blue-700 rounded-lg transition">
                    <Link to="/settings" className="flex items-center space-x-3">
                      <span>
                        <i className="fas fa-cog h-5 w-5"></i>
                      </span>
                      <span>Settings</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

           
                  <div className="p-4 border-t logout flex flex-col items-center mt-auto">

                    <div className="flex items-start mb-4 w-full justify-evenly ">
                    <div className=" rounded-full border-3 border-blue-800">
                    
                      <img src={me} alt="Profile" className="h-10 w-10 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-col flex flex-start">
                      <span className="font-bold">{ details.username }</span>
                      <span className="text-sm text-gray-300">{ details.position }</span>
                    </div>
                    </div>

                    {/* Logout button (desktop sidebar, bottom) */}
              <button
                onClick={logging}
                className="flex items-center justify-center space-x-2 px-4 py-2 element hover:element rounded-lg transition text w-full border"
              >
                <span className="flex items-center py-2k">
                  <i className="fas fa-sign-out-alt h-5 w-5 translate-y-1"></i>
                </span>
                <span className="font-bold">{logButton}</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64 transition-all">

         
          <header className="gradient-bg shadow-md drop-shadow-lg p-3 flex justify-evenly md:justify-center md:px-8 items-center w-full fixed top-0 left-0 z-20 md:left-64 md:w-[calc(100%-16rem)] ">
            <div className="flex items-center space-x-4 justify-center">
              {/* Logo */}
              <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
              <h1 className="text-lg font-semibold text text-center items-center family">
                FITS Tanza - Municipal Agriculture Office
              </h1>
            </div>

            {/* Mobile menu toggle button */}
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
          </header>

          {/* Render children below the header */}
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-grey bg-opacity-10 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 gradient-bg text-white drop-shadow-lg shadow-lg w-64 z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden flex flex-col justify-between`}
        id="mobile-menu"
      >
        <div>
          <div className="p-4 border-b border-blue-500 flex justify-between items-center">
            <h1 className="text-2xl font-bold family">FITS -Tanza</h1>
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
          <nav className="mt-6">
            <ul className="space-y-4">

              {/* Home Link */}
              <li className="p-6 hover:bg-blue-700 rounded-lg transition">
                <Link to="/" className="flex items-center space-x-3">
                  <span>
                    <i className="fas fa-home h-5 w-5"></i>
                  </span>
                  <span>Home</span>
                </Link>
              </li>

              {/* Profile Link */}
              <li className="p-6 hover:bg-blue-700 rounded-lg transition">
                <Link to="/profiles" className="flex items-center space-x-3">
                  <span>
                    <i className="fas fa-user-circle h-5 w-5"></i>
                  </span>
                  <span>Profile</span>
                </Link>
              </li>

              {/* Enrollment Link */}
              <li className="p-6 hover:bg-blue-700 rounded-lg transition">
                <Link to="/enrollment" className="flex items-center space-x-3">
                  <span>
                    <i className="fas fa-user-plus h-5 w-5"></i>
                  </span>
                  <span>Enrollment</span>
                </Link>
              </li>

              {/* EIC Link */}
              <li className="p-6 hover:bg-blue-700 rounded-lg transition">
                <Link to="/EIC" className="flex items-center space-x-3">
                  <span>
                    <i className="fas fa-id-card h-5 w-5"></i>
                  </span>
                  <span>EIC</span>
                </Link>
              </li>

              {/* Settings Link */}
              <li className="p-6 hover:bg-blue-700 rounded-lg transition">
                <Link to="/settings" className="flex items-center space-x-3">
                  <span>
                    <i className="fas fa-cog h-5 w-5"></i>
                  </span>
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Profile and Logout at the bottom */}
        <div className="p-4 border-t logout flex flex-col items-center mt-auto">

                    <div className="flex items-start mb-4 w-full justify-evenly ">
                    <div className=" rounded-full border-3 border-blue-800">
                    
                      <img src={me} alt="Profile" className="h-10 w-10 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-col flex flex-start">
                      <span className="font-bold">{ details.username }</span>
                      <span className="text-sm text-gray-300">{ details.position }</span>
                    </div>
                    </div>


          {/* Logout button (mobile sidebar, bottom) */}
          <button 
            className="flex items-center justify-center space-x-2 px-4 py-1 element hover:element rounded-lg transition text w-full border"
            onClick={logging}
          >
            <span className="flex items-center py-2">
              <i className="fas fa-sign-out-alt h-5 w-5 translate-y-1"></i>
            </span>
            <span className="font-bold">{logButton}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
