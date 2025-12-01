import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext.jsx';


// COMPONENTS
import logo from '../../Assets/Logo.png';
import ebg from '../Assets/elementbg.webp';
import pipol from '../Assets/pinoy.webp'; 


export default function Login() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const username = useRef(null);
    const password = useRef(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
        <div className={`min-h-screen flex items-center justify-center px-2 py-6 sm:py-10 ${theme === 'dark' ? 'bg-gray-900' : ''}`} style={{
            backgroundImage: theme === 'dark' ? 'none' : `url(${ebg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform',
        }}>
            <div className={`relative flex flex-col md:flex-row w-full max-w-5xl md:h-[600px] rounded-3xl shadow-2xl overflow-hidden border ${
                theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
            }`}>
                {/* Left: Form Section */}
                <div className={`flex-1 flex flex-col justify-center px-4 sm:px-8 py-8 md:py-10 z-10 max-h-[90vh] md:max-h-[600px] overflow-y-auto custom-scrollbar ${
                    theme === 'dark' ? 'text-gray-100' : ''
                }`}>
            {/* Custom Scrollbar Styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 9px;
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(120deg, #2563eb 60%, #1e40af 100%);
                    border-radius: 16px;
                    border: 2px solid #e0e7ef;
                    box-shadow: 0 2px 8px 0 rgba(30,64,175,0.10);
                    min-height: 36px;
                    transition: background 0.25s, border 0.25s;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(120deg, #1e40af 60%, #2563eb 100%);
                    border: 2px solid #2563eb;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: green;
                    border-radius: 16px;
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                       scrollbar-color: #22c55e #bbf7d0;
                }
            `}</style>
                    <div className="flex flex-col items-center mb-8 ">
                        <img src={logo} alt="FITS Tanza Logo" className="h-12 w-12 rounded-full mb-3 shadow-xl  z-30 relative mt-5" />
                        <h1 className={`font-extrabold text-3xl md:text-4xl tracking-tight mb-1 text-center drop-shadow font-sans uppercase ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-700'
                        }`} style={{letterSpacing: '0.04em'}}>FITS - Tanza</h1>
                        <span className={`text-sm md:text-sm font-semibold tracking-wide mb-2 text-center ${
                            theme === 'dark' ? 'text-green-300' : 'text-green-600'
                        }`} style={{textShadow: '0 2px 8px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.07)'}}>Municipal Agriculture Office</span>
                        <span className={`text-base md:text-lg text-center ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>Sign in to your account</span>
                    </div>
                    <form
                        className="space-y-6 w-full max-w-md mx-auto"
                        onSubmit={async (event) => {
                            event.preventDefault();
                            setIsLoading(true);
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
                                setIsLoading(false);
                                return;
                            }
                            const data = await response.json();
                            if (!response.ok) {
                                setIsLoading(false);
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
                            <label htmlFor="username" className={`block text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            }`}>Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                ref={username}
                                autoComplete="username"
                                className={`w-full px-4 py-2 mt-1 border rounded-md ${
                                    theme === 'dark' 
                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-green-400 focus:ring-green-400' 
                                        : 'border-gray-300 bg-white focus:border-green-500 focus:ring-green-500'
                                }`}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            }`}>Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    required
                                    ref={password}
                                    className={`w-full px-4 py-2 pr-12 mt-1 border rounded-md ${
                                        theme === 'dark' 
                                            ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-green-400 focus:ring-green-400' 
                                            : 'border-gray-300 bg-white focus:border-green-500 focus:ring-green-500'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute inset-y-0 right-0 flex items-center px-3 transition-colors ${
                                        theme === 'dark' 
                                            ? 'text-gray-400 hover:text-gray-200' 
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => handleRememberMeChange(e.target.checked)}
                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">Forgot password?</Link>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full py-3 mt-4 mb-6 text-white rounded-lg font-semibold shadow transition-all flex items-center justify-center gap-2 ${
                                isLoading 
                                    ? 'bg-green-500 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:scale-[1.02]'
                            }`}
                        >
                            {isLoading && (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                        </button>
                        {/* <div className="flex items-center gap-2  w-full">
                            <span className="flex-grow border-t border-gray-300"></span>
                            <span className="mx-2 text-gray-500 text-sm">or</span>
                            <span className="flex-grow border-t border-gray-300"></span>
                        </div>
                        <button type="button" className="w-full flex items-center justify-center px-4 py-2 mt-4 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                            Google
                        </button> */}
        
                    </form>
                </div>
                {/* Right: Image & Wavy Divider with FITS Tanza branding */}
                <div className="hidden md:block relative w-1/2 h-[80dvh] justify-self-center bg-transparent">
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="relative w-[95%] h-[95%] flex items-center justify-center">
                            <img
                                src={pipol}
                                alt="side"
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover rounded-tl-[120px] rounded-br-[120px] rounded-tr-none rounded-bl-none shadow-2xl absolute top-0 left-0"
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
