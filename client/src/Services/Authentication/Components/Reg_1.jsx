import React from 'react'
import { Link } from 'react-router-dom'

import cover from '../../../Services/Authentication/Assets/Cover.jpg'
import logo from '../../../Services/Authentication/Assets/Logo.png'

export default function Reg_1() {
    return (
        <div className="relative min-h-screen h-screen w-screen flex items-center justify-center bg-gray-100 overflow-hidden">
            <img
                src={cover}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm"
                style={{ zIndex: 0 }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                <div className="flex flex-col items-center justify-center mb-4 text-center px-2">
                    <img src={logo} alt="" className="rounded-full mb-3 h-14 w-14 md:h-20 md:w-20" />
                    <h1 className="font-bold text-lg md:text-2xl text-center px-2">
                        FITS Tanza - Municipal Agriculture Office
                    </h1>
                </div>
                <div className="w-[95%] max-w-xs sm:max-w-sm md:max-w-md px-4 sm:px-6 md:px-10 py-6 space-y-6 rounded-lg shadow-lg border border-white/20 backdrop-blur-lg backdrop-brightness-95 bg-white shadow-black">
                    <h2 className="text-lg md:text-2xl font-bold text-center text-gray-800">Register Now</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="fname" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="fname"
                                name="fname"
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="lname" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lname"
                                name="lname"
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender
                            </label>
                            <div className="flex items-center space-x-4 mb-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        required
                                        className="form-radio text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Male</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        required
                                        className="form-radio text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Female</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="other"
                                        required
                                        className="form-radio text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Other</span>
                                </label>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500"
                        >
                            <Link to="/register/2" className="block w-full h-full">
                                Next
                            </Link>
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
                        <p className="mt-4 text-center text-sm text-gray-700">
                            Already have an account?{' '}
                            <a href="register.html" className="text-blue-600 hover:underline">
                                Sign in
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
