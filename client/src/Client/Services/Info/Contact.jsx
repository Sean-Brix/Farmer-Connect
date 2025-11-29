import React from 'react'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'

export default function contact() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  return (
    <>
      <Navbar />
      <div className={`contact-page px-4 mt-10 sm:mt-25 md:mt-25 sm:px-6 py-8 sm:py-12 max-w-4xl mx-auto pt-24 sm:pt-20 md:pt-16 min-h-screen ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <h1 className={`text-4xl sm:text-5xl font-extrabold mb-2 sm:mb-3 tracking-tight ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Contact FITS-Tanza
        </h1>
        <p className={`mb-8 sm:mb-10 text-base sm:text-lg ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          We value your feedback and inquiries. Connect with us for support, partnership, or general questions. Our team is ready to assist you!
        </p>
        <div className="mb-10 sm:mb-12 flex flex-col gap-8">
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <div className={`p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col gap-5 border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <h2 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Details
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>General:</span>
                <a href="mailto:agriculture.tanza@yahoo.com" className={`hover:underline break-all ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>agriculture.tanza@yahoo.com</a>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Support:</span>
                <a href="mailto:support@fits-tanza.com" className={`hover:underline break-all ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>support@fits-tanza.com</a>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Phone:</span>
                <a href="tel:+15551234567" className={`hover:underline ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>+46 23 076 80</a>
              </div>
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Hours:</span>
                <span className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Mon-Fri, 9am - 6pm</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Website:</span>
                <a href="https://fits-tanza.com" className={`hover:underline break-all ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`} target="_blank" rel="noopener noreferrer">
                  fits-tanza.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>VAT:</span>
                <span className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>VAT123456789</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Company Reg:</span>
                <span className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>REG-987654321</span>
              </div>
            </div>

            {/* Socials Modern Card */}
            <div className={`p-6 sm:p-8 rounded-3xl shadow-xl border flex flex-col gap-4 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <h3 className={`font-semibold mb-2 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Socials
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                <a href="https://facebook.com/fitstanza" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition border shadow-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                }`} target="_blank" rel="noopener noreferrer">
                  <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Facebook</span>
                </a>
                <a href="https://instagram.com/fitstanzacavite" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition border shadow-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                }`} target="_blank" rel="noopener noreferrer">
                  <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.337 2.396 3.51 2.338 4.788.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.058 1.278.33 2.451 1.297 3.418.967.967 2.14 1.239 3.418 1.297C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.278-.058 2.451-.33 3.418-1.297.967-.967 1.239-2.14 1.297-3.418.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.058-1.278-.33-2.451-1.297-3.418-.967-.967-2.14-1.239-3.418-1.297C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Instagram</span>
                </a>
              </div>
            </div>

     
          </div>
        </div>
       
        <div className="mt-8 sm:mt-12 text-center text-gray-500 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} FITS-Tanza. All rights reserved. | <a href="/terms" className="hover:underline">Terms of Service</a>
        </div>
      </div>
      <style>{`
        html, body, #root {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
          display: none;
        }
        .letter-spacing-wide {
          letter-spacing: 0.15em;
        }
      `}</style>
    </>
  )
}
