import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// COMPONENTS
import cover from '../Assets/Cover.jpg';
import logo from '../../Assets/Logo.png';

export default function Login() {
    const navigate = useNavigate();
    const username = useRef(null);
    const password = useRef(null);

    // Modern Alert State
    const [alert, setAlert] = React.useState({
        show: false,
        message: '',
        type: '',
    });

    // Helper to show alert
    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(
            () => setAlert({ show: false, message: '', type: '' }),
            2000
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 min-h-screen">
            <img
                src={cover}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-50 blur-md pointer-events-none select-none"
            />

            {/* Modern Centered Alert */}
            {alert.show && (
                <div
                    className={`fixed top-6 left-1/2 z-50 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3
                    ${
                        alert.type === 'success'
                            ? 'bg-green-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                    }`}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        {alert.type === 'success' ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        )}
                    </svg>
                    <span className="font-medium">{alert.message}</span>
                </div>
            )}

            <div className="relative z-10 flex flex-col items-center justify-center  w-full h-full px-4 py-8">
                <div className="flex items-center justify-center mb-10 text-center flex-col">
                    <img
                        src={logo}
                        alt=""
                        className="rounded-full mt-2 mb-6 h-18 w-18 sm:h-16 sm:w-16 xs:h-12 xs:w-12"
                    />
                    <h1 className="px-6 font-bold text-xl sm:text-xl xs:text-lg text-center">
                        FITS Tanza - Municipal Agriculture Office
                    </h1>
                </div>

                <div className="w-full max-w-md p-6 sm:p-8 space-y-6 rounded-lg shadow-lg border border-white/20 backdrop-brightness-95 bg-white shadow-black">
                    <h2 className="text-2xl font-bold text-center text-gray-800">
                        Sign in to your account
                    </h2>
                    <form
                        className="space-y-4"
                        onSubmit={async (event) => {
                            event.preventDefault();

                            const response = await fetch('/auth/login', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    username: username.current.value,
                                    password: password.current.value,
                                }),
                            });

                            const data = await response.json();

                            if (!response.ok) {

                                // USER ERROR
                                if (response.status === 400) {

                                    // 'username or password required'

                                    return;
                                } 
                                
                                // USER ERROR
                                if (response.status === 404) {

                                    // 'User not found' ( Username does not exist );

                                    return;
                                } 

                                // USER ERROR
                                if (response.status === 401) {

                                    // 'Invalid password' ( Password is incorrect );

                                    return;
                                } 

                                // SERVER ERROR HANDLING
                                if (response.status === 500) {

                                    // 'Internal server error' ( Something went wrong );
                                    return;
                                }
                                
                            }

                            if (data.user.access == 'User') {

                                // SUCCESSFUL LOGIN
                                
                                navigate('/');
                                return;
                            }

                            if (data.user.access == 'Admin' || data.user.access == 'Super_Admin') {

                                // SUCCESSFUL ADMIN LOGIN

                                navigate('/admin');
                                return;
                            }
                            
                        }}
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                ref={username}
                                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                ref={password}
                                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 border-black-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>

                            <Link
                                to="/"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500"
                        >
                            Sign In
                        </button>

                        {/* <div className="flex items-center my-4">
                            <span className="flex-grow border-t border-black-300"></span>
                            <span className="mx-2 text-black-500 text-sm">
                                or
                            </span>
                            <span className="flex-grow border-t border-black-300"></span>
                        </div>

                        <button
                            type="button"
                            className="w-full flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="h-5 w-5 mr-2"
                            />
                            Connect with Google
                        </button> */}

                        <p className="mt-6 text-center text-sm text-gray-700">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-blue-600 hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
