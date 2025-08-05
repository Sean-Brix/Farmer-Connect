import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


// COMPONENTS
import cover from '../Assets/Cover.jpg';
import logo from '../../Assets/Logo.png';

export default function Login() {
    const navigate = useNavigate();
    const username = useRef(null);
    const password = useRef(null);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        const savedPassword = localStorage.getItem('rememberedPassword');
        if (savedUsername && savedPassword) {
            if (username.current) username.current.value = savedUsername;
            if (password.current) password.current.value = savedPassword;
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch('/auth/is-authenticated', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.check) {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            }
        };
        checkAuthentication();
    }, []);

    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 2000);
    };
    const handleRememberMeChange = (checked) => {
        setRememberMe(checked);
        if (!checked) {
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberedPassword');
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center">
            {/* Background Image */}
            <img
                src={cover}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-80 blur-sm"
                style={{ zIndex: 0 }}
            />
            {/* Overlay for dimming effect */}
            <div className="absolute inset-0 bg-black/20" style={{ zIndex: 1 }}></div>

            {/* Centered Form Card */}
            <div className="relative z-10 w-full max-w-lg mx-auto p-8 rounded-2xl shadow-2xl bg-white/90 border border-gray-200 flex flex-col items-center">
                <img src={logo} alt="Logo" className="rounded-full h-16 w-16 mb-4" />
                <h1 className="font-bold text-2xl text-center mb-2">FITS Tanza - Municipal Agriculture Office</h1>
                <span className="text-gray-500 text-center text-base mb-6"></span>
                <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Sign in your account</h2>
                <form
                    className="space-y-4 w-full"
                    onSubmit={async (event) => {
                        event.preventDefault();
                        let response;
                        try {
                            response = await fetch('/auth/login', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    username: username.current.value,
                                    password: password.current.value,
                                    rememberMe: rememberMe,
                                }),
                            });
                        } catch (error) {
                            showAlert('Network error, please try again later.', 'error');
                            return;
                        }
                        const data = await response.json();
                        if (!response.ok) {
// ...existing code above...
                            if (response.status === 400) {
                                showAlert('Username and password are required.', 'error');
                                return;
                            }
                            if (response.status === 404) {
                                showAlert('Username not found', 'error');
                                return;
                            }
                            if (response.status === 401) {
                                showAlert('Incorrect Password', 'error');
                                return;
                            }
                            if (response.status === 500) {
                                showAlert('Something went wrong, please try again later.', 'error');
                                return;
                            }
                        }
                        if (data.user.access == 'User') {
                            if (rememberMe) {
                                localStorage.setItem('rememberedUsername', username.current.value);
                                localStorage.setItem('rememberedPassword', password.current.value);
                            } else {
                                localStorage.removeItem('rememberedUsername');
                                localStorage.removeItem('rememberedPassword');
                            }
                            navigate('/');
                            return;
                        }
                        if (data.user.access == 'Admin' || data.user.access == 'Super_Admin') {
                            if (rememberMe) {
                                localStorage.setItem('rememberedUsername', username.current.value);
                                localStorage.setItem('rememberedPassword', password.current.value);
                            } else {
                                localStorage.removeItem('rememberedUsername');
                                localStorage.removeItem('rememberedPassword');
                            }
                            navigate('/admin');
                            return;
                        }
                    }}
                    autoComplete="on"
                >
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            ref={username}
                            autoComplete="username"
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            ref={password}
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => handleRememberMeChange(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-white bg-yellow-400 rounded-md hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-semibold">Submit</button>
                    <div className="flex items-center gap-2 mt-4 w-full">
                        <span className="flex-grow border-t border-gray-300"></span>
                        <span className="mx-2 text-gray-500 text-sm">or</span>
                        <span className="flex-grow border-t border-gray-300"></span>
                    </div>
                    <button type="button" className="w-full flex items-center justify-center px-4 py-2 mt-4 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                        Google
                    </button>
                    <p className="mt-6 text-center text-sm text-gray-700">Have any account? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link></p>
                    <div className="mt-2 text-center text-xs text-gray-400">
                        <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
                    </div>
                </form>
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
