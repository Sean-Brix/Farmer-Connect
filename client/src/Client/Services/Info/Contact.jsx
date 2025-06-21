import React from 'react'
import Navbar from '../../Components/Navbar'

export default function contact() {
  return (
    <>
      <Navbar />
      {/* Material Icons CDN for icons */}
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <div className="contact-page px-4 mt-10 sm:mt-25 md:mt-25 sm:px-6 py-8 sm:py-12 max-w-4xl mx-auto pt-20 ">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 sm:mb-3 text-blue-800 tracking-tight">
          Contact FITS-Tanza
        </h1>
        <p className="mb-8 sm:mb-10 text-gray-600 text-base sm:text-lg">
          We value your feedback and inquiries. Connect with us for support, partnership, or general questions. Our team is ready to assist you!
        </p>
        <div className="mb-10 sm:mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-blue-50 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col gap-5 border border-blue-200">
              <h2 className="text-2xl font-bold mb-2 text-blue-700 flex items-center gap-2">
                <span className="material-icons text-blue-500">contact_phone</span>
                Contact Details
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="material-icons text-blue-500">email</span>
                <span className="font-medium text-blue-900">General:</span>
                <a href="mailto:info@fits-tanza.com" className="text-blue-700 hover:underline break-all">agriculture.tanza@yahoo.com</a>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="material-icons text-blue-500">support_agent</span>
                <span className="font-medium text-blue-900">Support:</span>
                <a href="mailto:support@fits-tanza.com" className="text-blue-700 hover:underline break-all">support@fits-tanza.com</a>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="material-icons text-blue-500">phone</span>
                <span className="font-medium text-blue-900">Phone:</span>
                <a href="tel:+15551234567" className="text-blue-700 hover:underline">+46 23 076 80</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-icons text-blue-500">schedule</span>
                <span className="font-medium text-blue-900">Hours:</span>
                <span className="text-blue-900">Mon-Fri, 9am - 6pm</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="material-icons text-blue-500">public</span>
                <span className="font-medium text-blue-900">Website:</span>
                <a href="https://fits-tanza.com" className="text-blue-700 hover:underline break-all" target="_blank" rel="noopener noreferrer">
                  fits-tanza.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-icons text-blue-500">verified_user</span>
                <span className="font-medium text-blue-900">VAT:</span>
                <span className="text-blue-900">VAT123456789</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-icons text-blue-500">business</span>
                <span className="font-medium text-blue-900">Company Reg:</span>
                <span className="text-blue-900">REG-987654321</span>
              </div>
            </div>
            {/* Socials Modern Card */}
            <div className="bg-blue-50 p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-200 flex flex-col gap-4">
              <h3 className="text-blue-700 font-semibold mb-2 flex items-center gap-2">
                <span className="material-icons text-blue-500">share</span>
                Socials
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                <a href="https://facebook.com/fitstanza" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition border border-blue-200 shadow-sm" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                  <span className="font-medium text-blue-900">Facebook</span>
                </a>
                <a href="https://twitter.com/fitstanza" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition border border-blue-200 shadow-sm" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.418A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21 0-.423-.016-.634A9.936 9.936 0 0 0 24 4.557z"/></svg>
                  <span className="font-medium text-blue-900">Twitter</span>
                </a>
                <a href="https://instagram.com/fitstanzacavite" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition border border-blue-200 shadow-sm" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.337 2.396 3.51 2.338 4.788.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.058 1.278.33 2.451 1.297 3.418.967.967 2.14 1.239 3.418 1.297C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.278-.058 2.451-.33 3.418-1.297.967-.967 1.239-2.14 1.297-3.418.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.058-1.278-.33-2.451-1.297-3.418-.967-.967-2.14-1.239-3.418-1.297C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                  <span className="font-medium text-blue-900">Instagram</span>
                </a>
                <a href="https://linkedin.com/company/fitstanza" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition border border-blue-200 shadow-sm" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76s.784-1.76 1.75-1.76 1.75.79 1.75 1.76-.784 1.76-1.75 1.76zm13.5 11.27h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.599v5.597z"/></svg>
                  <span className="font-medium text-blue-900">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
          {/* Team Card */}
          <div className="bg-blue-100 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col gap-6 border border-blue-300">
            <h2 className="text-2xl font-bold mb-2 text-blue-700 flex items-center gap-2">
              <span className="material-icons text-blue-500">groups</span>
              Our Team
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Rhenzy+Cruzat&background=3b82f6&color=fff" alt="Rhenzy Cruzat" className="w-12 h-12 rounded-full shadow" />
                <div>
                  <span className="font-semibold text-lg text-blue-900">Rhenzy Cruzat</span>
                  <div className="text-blue-700 text-sm font-medium">Front End Developer</div>
                  <div className="text-blue-500 text-xs">{'rhenzy.cruzat@FITS-Tanza.com'}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=KC+Sean+Brix&background=2563eb&color=fff" alt="KC Sean Brix" className="w-12 h-12 rounded-full shadow" />
                <div>
                  <span className="font-semibold text-lg text-blue-900">KC Sean Brix</span>
                  <div className="text-blue-700 text-sm font-medium">Back End Developer</div>
                  <div className="text-blue-500 text-xs">{'kc.seanbrix@FITS-Tanza.com'}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Maphil+Grace+Alquizola&background=1d4ed8&color=fff" alt="Maphil Grace Alquizola" className="w-12 h-12 rounded-full shadow" />
                <div>
                  <span className="font-semibold text-lg text-blue-900">Maphil Grace Alquizola</span>
                  <div className="text-blue-700 text-sm font-medium">Documentation & Papers</div>
                  <div className="text-blue-500 text-xs">{'maphil.alquizola@FITS-Tanza.com'}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Rhodmar+Valenzuela&background=1d4ed8&color=fff" alt="Rhodmar Valenzuela" className="w-12 h-12 rounded-full shadow" />
                <div>
                  <span className="font-semibold text-lg text-blue-900">Rhodmar Valenzuela</span>
                  <div className="text-blue-700 text-sm font-medium">QA Tester</div>
                  <div className="text-blue-500 text-xs">{'rhodmar.valenzuela@FITS-Tanza.com'}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="material-icons text-blue-500">support_agent</span>
                <div>
                  <span className="font-semibold text-base text-blue-900">Support Hotline</span>
                  <div className="text-blue-500 text-xs sm:text-sm">+1 (555) 987-6543</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Contact Form */}
        <form className="flex flex-col gap-6 bg-blue-50 p-6 sm:p-10 rounded-3xl shadow-2xl border border-blue-200">
          <h2 className="text-2xl font-bold mb-2 text-blue-700">Send Us a Message</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="font-medium text-blue-900">First Name</span>
              <input
                type="text"
                name="firstName"
                required
                autoComplete="given-name"
                className="border border-blue-200 bg-blue-100 text-blue-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium text-blue-900">Last Name</span>
              <input
                type="text"
                name="lastName"
                required
                autoComplete="family-name"
                className="border border-blue-200 bg-blue-100 text-blue-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="font-medium text-blue-900">Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="border border-blue-200 bg-blue-100 text-blue-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium text-blue-900">Phone (optional)</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                className="border border-blue-200 bg-blue-100 text-blue-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-blue-900">Subject</span>
            <input
              type="text"
              name="subject"
              required
              className="border border-blue-200 bg-blue-100 text-blue-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-blue-900">Message</span>
            <textarea
              name="message"
              rows="5"
              required
              className="border border-blue-200 bg-blue-100 text-blue-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition"
            />
          </label>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="privacy" required className="accent-blue-600" />
            <label htmlFor="privacy" className="text-sm text-blue-700">
              I agree to the <a href="/privacy" className="text-blue-700 hover:underline">Privacy Policy</a>
            </label>
          </div>
          <button
            type="submit"
            className="py-3 px-8 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:to-blue-700 transition-colors font-semibold text-lg shadow"
          >
            Send Message
          </button>
        </form>
        <div className="mt-8 sm:mt-12 text-center text-blue-400 text-xs sm:text-sm">
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
