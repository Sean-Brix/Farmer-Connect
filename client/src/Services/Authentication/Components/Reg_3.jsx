import React from 'react';
import cover from '../../../Services/Authentication/Assets/Cover.jpg';
import logo from '../../../Services/Authentication/Assets/Logo.png';
import { Link } from 'react-router-dom';

export default function Reg_3() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 overflow-hidden min-h-screen">
            <img
                src={cover}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm"
            />
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                <div className="flex flex-col items-center justify-center mb-6 text-center">
                    <img src={logo} alt="" className="rounded-full mb-4 h-16 w-16 sm:h-20 sm:w-20" />
                    <h1 className="px-4 font-bold text-lg sm:text-2xl text-center">
                        FITS Tanza - Municipal Agriculture Office
                    </h1>
                </div>
                <div className="w-full max-w-xs sm:max-w-md p-6 sm:p-8 space-y-6 bg-white rounded-lg shadow-lg border border-gray-300 backdrop-blur-md bg-gray-500 bg-opacity-70">
                    <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">Register Now</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
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
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                            />
                        </div>
                        <div className="flex items-center my-3">
                            <input
                                id="remember"
                                name="remember"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500"
                        >
                            Register
                        </button>
                        <div className="flex items-center my-2">
                            <span className="flex-grow border-t border-gray-300"></span>
                            <span className="mx-2 text-gray-500 text-sm">or</span>
                            <span className="flex-grow border-t border-gray-300"></span>
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
                        <p className="mt-4 text-center text-sm text-gray-700">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
