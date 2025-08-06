import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


// COMPONENTS
import cover from '../Assets/Cover.jpg';
import logo from '../../Assets/Logo.png';
import bg from '../Assets/bg.jpg';
import i1 from '../Assets/i1.jpg';
import i2 from '../Assets/i2.jpg';
import i3 from '../Assets/i3.jpg';

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
        <div className="min-h-screen flex items-center justify-center px-2 py-6 sm:py-10 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
            <div className="relative flex flex-col md:flex-row w-full max-w-5xl md:h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Left: Form Section */}
                <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-8 md:py-10 z-10 max-h-[90vh] md:max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <div className="flex flex-col items-center mb-8 ">
                        <h1 className="font-extrabold text-3xl md:text-4xl text-blue-700 tracking-tight mb-2 mt-3 text-center drop-shadow">Farmer Connect</h1>
                        <span className="text-gray-500 text-base md:text-lg text-center">Sign in to your account</span>
                    </div>
                    <form
                        className="space-y-6 w-full max-w-md mx-auto"
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
                        <button type="submit" className="w-full py-3 mt-4 mb-6 text-white bg-blue-600 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Sign In</button>
                        {/* <div className="flex items-center gap-2  w-full">
                            <span className="flex-grow border-t border-gray-300"></span>
                            <span className="mx-2 text-gray-500 text-sm">or</span>
                            <span className="flex-grow border-t border-gray-300"></span>
                        </div>
                        <button type="button" className="w-full flex items-center justify-center px-4 py-2 mt-4 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                            Google
                        </button> */}
                        <p className="mt-6 text-center text-sm text-gray-700">Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link></p>
                        <div className="mt-2 text-center text-xs text-gray-400">
                            <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
                        </div>
                    </form>
                </div>
                {/* Right: Image & Wavy Divider with FITS Tanza branding */}
                <div className="hidden md:block relative w-1/2 h-[80dvh] justify-self-center bg-transparent">
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="relative w-[95%] h-[95%] flex items-center justify-center">
                            <img
                                src={i3}
                                alt="side"
                                className="w-full h-full object-cover object-center rounded-tl-[120px] rounded-br-[120px] rounded-tr-none rounded-bl-none shadow-2xl absolute top-0 left-0"
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
                            {/* Slide indicators removed since only one image is used */}
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
