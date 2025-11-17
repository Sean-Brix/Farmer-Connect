import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import i1 from '../Assets/people.webp';
import ebg from '../Assets/elementbg.webp';
import logo from '../../Assets/Logo.png';

export default function ForgotPassword() {
    const { theme, isDark } = useTheme();
    const navigate = useNavigate();
    const email = useRef(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [loading, setLoading] = useState(false);

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 2000);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-2 py-6 sm:py-10 ${isDark ? 'bg-gray-900' : ''}`} style={{
            backgroundImage: isDark ? 'none' : `url(${ebg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            <div className={`relative flex flex-col md:flex-row w-full max-w-5xl md:h-[600px] rounded-3xl shadow-2xl overflow-hidden border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {/* Left: Form Section */}
                <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-8 md:py-10 z-10 max-h-[90vh] md:max-h-[600px] overflow-y-auto custom-scrollbar">
                {/* Custom Scrollbar Styles */}
                <style>{`
                 .custom-scrollbar::-webkit-scrollbar {
                    width: 9px;
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDark ? 'linear-gradient(120deg, #16a34a 60%, #22c55e 100%)' : 'linear-gradient(120deg, #22c55e 60%, #16a34a 100%)'};
                    border-radius: 16px;
                    border: 2px solid ${isDark ? '#15803d' : '#bbf7d0'};
                    box-shadow: 0 2px 8px 0 rgba(34,197,94,0.10);
                    min-height: 36px;
                    transition: background 0.25s, border 0.25s;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(120deg, #16a34a 60%, #22c55e 100%);
                    border: 2px solid #22c55e;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${isDark ? '#374151' : '#bbf7d0'};
                    border-radius: 16px;
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #22c55e ${isDark ? '#374151' : '#bbf7d0'};
                }
                `}</style>
                    <div className="flex flex-col items-center mb-8 ">
                        <img src={logo} alt="FITS Tanza Logo" className="h-12 w-12 rounded-full mb-3 shadow-xl  z-30 relative mt-5" />
                        <h1 className={`font-extrabold text-3xl md:text-4xl tracking-tight mb-1 text-center drop-shadow font-sans uppercase ${isDark ? 'text-green-400' : 'text-green-700'}`} style={{letterSpacing: '0.04em'}}>FITS - Tanza</h1>
                        <span className={`text-sm md:text-sm font-semibold tracking-wide mb-2 text-center ${isDark ? 'text-green-300' : 'text-green-600'}`} style={{textShadow: '0 2px 8px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.07)'}}>Municipal Agriculture Office</span>
                        <span className={`text-base md:text-lg text-center ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Enter your registered email address below and we'll send you a link to reset your password.</span>
                    </div>
                    <form
                        className="space-y-6 w-full max-w-md mx-auto"
                        onSubmit={async (event) => {
                            event.preventDefault();
                            setLoading(true);
                            try {
                                const response = await fetch('/auth/forgot-password', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email: email.current.value }),
                                });
                                const data = await response.json();
                                if (!response.ok) {
                                    showAlert(data.message || 'Failed to send reset link', 'error');
                                } else {
                                    showAlert('Password reset link sent to your email!', 'success');
                                }
                            } catch (error) {
                                showAlert('Network error, please try again later.', 'error');
                            }
                            setLoading(false);
                        }}
                    >
                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                ref={email}
                                autoComplete="email"
                                className={`w-full px-4 py-2 mt-1 border rounded-md focus:ring-green-500 focus:border-green-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'}`}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 mb-6 text-white bg-green-600 rounded-lg font-semibold shadow hover:bg-green-700 transition disabled:opacity-60"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        <p className={`mt-6 text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Remembered your password?{' '}
                            <Link to="/login" className="text-green-600 hover:underline">Sign in</Link>
                        </p>
                    </form>
                </div>
                {/* Right: Image section matching Login layout */}
                <div className="hidden md:block relative w-1/2 h-[80dvh] justify-self-center bg-transparent">
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="relative w-[95%] h-[95%] flex items-center justify-center">
                            <img
                                src={i1}
                                alt="side"
                                className="w-full h-full object-cover object-center  rounded-tl-[120px] rounded-br-[120px] rounded-tr-none rounded-bl-none shadow-2xl absolute top-0 left-0"
                                style={{position:'absolute', objectPosition: 'center top'}} 
                            />
                            {/* Overlay for darkening and soft edge */}
                            <div className="absolute inset-0 rounded-tl-[120px] rounded-br-[120px] rounded-tr-none rounded-bl-none bg-gradient-to-br from-black/40 via-black/20 to-black/40 pointer-events-none" style={{zIndex:20}}></div>
                            {/* Branding removed from right image section, now in left form section */}
                        </div>
                    </div>
                </div>
            </div>
            {/* Modern Centered Alert */}
            {alert.show && (
                <div className={`fixed top-6 left-1/2 z-50 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${alert.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {alert.type === 'success' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        )}
                    </svg>
                    <span className="font-medium">{alert.message}</span>
                </div>
            )}
        </div>
    );
}
