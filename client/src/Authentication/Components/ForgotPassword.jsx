import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cover from '../Assets/Cover.jpg';
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
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 min-h-screen">
            <img
                src={cover}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-50 blur-md pointer-events-none select-none"
            />
            {alert.show && (
                <div
                    className={`fixed top-6 left-1/2 z-50 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${alert.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}
                >
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
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 py-8">
                <div className="flex items-center justify-center mb-10 text-center flex-col">
                    <img src={logo} alt="" className="rounded-full mt-2 mb-6 h-18 w-18 sm:h-16 sm:w-16 xs:h-12 xs:w-12" />
                    <h1 className="px-6 font-bold text-xl sm:text-xl xs:text-lg text-center">FITS Tanza - Municipal Agriculture Office</h1>
                </div>
                <div className="w-full max-w-md p-6 sm:p-8 space-y-6 rounded-lg shadow-lg border border-white/20 backdrop-brightness-95 bg-white shadow-black">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>
                    <p className="text-center text-gray-600 text-base mb-2">
                        Enter your registered email address below and we'll send you a link to reset your password.
                    </p>
                   
                    <form
                        className="space-y-4"
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
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 disabled:opacity-60"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        <p className="mt-6 text-center text-sm text-gray-700">
                            Remembered your password?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
