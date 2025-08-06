import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import i1 from '../Assets/i3.jpg';
import logo from '../../Assets/Logo.png';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const email = useRef(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [loading, setLoading] = useState(false);

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100 px-2 py-6 sm:py-10">
            <div className="relative flex flex-col md:flex-row w-full max-w-5xl md:h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Left: Form Section */}
                <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-8 md:py-10 z-10 max-h-[90vh] md:max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                    <div className="flex flex-col items-center mb-8 ">
                        <h1 className="font-extrabold text-3xl md:text-4xl text-blue-700 tracking-tight mb-6 mt-20 text-center drop-shadow">Forgot Password</h1>
                        <span className="text-gray-500 text-base md:text-lg text-center">Enter your registered email address below and we'll send you a link to reset your password.</span>
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                ref={email}
                                autoComplete="email"
                                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 mb-6 text-white bg-blue-600 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        <p className="mt-6 text-center text-sm text-gray-700">
                            Remembered your password?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
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
                                style={{position:'absolute'}} 
                            />
                            {/* Overlay for darkening and soft edge */}
                            <div className="absolute inset-0 rounded-tl-[120px] rounded-br-[120px] rounded-tr-none rounded-bl-none bg-gradient-to-br from-black/40 via-black/20 to-black/40 pointer-events-none" style={{zIndex:20}}></div>
                            {/* Centered FITS Tanza branding, moved a little bit on top */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center drop-shadow-2xl z-30" style={{ justifyContent: 'flex-start', top: '20%' }}>
                                <img src={logo} alt="FITS Tanza Logo" className="h-20 w-20 rounded-full mb-3 shadow-xl border-4 border-blue-400 z-30 relative" />
                                <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-1 font-sans uppercase z-30 relative"
                                    style={{
                                        letterSpacing: '0.04em',
                                        textShadow: '0 3px 12px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.7)',
                                    }}
                                >FITS Tanza</span>
                                <span className="text-lg md:text-xl font-semibold text-white tracking-wide mb-1 z-30 relative"
                                    style={{
                                        textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.7)',
                                    }}
                                >Municipal Agriculture Office</span>
                            </div>
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
