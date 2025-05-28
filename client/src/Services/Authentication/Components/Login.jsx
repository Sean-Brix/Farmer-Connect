import React from 'react';
import { Link } from 'react-router-dom';

// COMPONENTS
import cover from '../../../Services/Authentication/Assets/Cover.jpg';
import logo from '../../../Services/Authentication/Assets/Logo.png';

export default function Login() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <img
                src={cover}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm"
            />

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
                    <h2 className="text-2xl font-bold text-center text-gray-800">Sign in to your account</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 border-black-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>

                            <Link to="/" className="text-sm text-blue-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500"
                        >
                            <Link to="/">Next</Link>
                        </button>

                        <div className="flex items-center my-4">
                            <span className="flex-grow border-t border-black-300"></span>
                            <span className="mx-2 text-black-500 text-sm">or</span>
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
                        </button>

                        <p className="mt-6 text-center text-sm text-gray-700">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
