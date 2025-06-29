import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import cover from '../Assets/Cover.jpg';
import logo from '../../Assets/Logo.png';

// Wrapper for passing in Navigate Hooks
function register_wrapper() {
    const navigate = useNavigate();
    return <Register navigate={navigate} />;
}

// Register Component
class Register extends Component {
    // Fields
    inputs = {
        firstName: '',
        lastName: '',
        gender: '',
        clientProfile: '',
        address: '',
        telephoneNumber: '',
        cellphoneNumber: '',
        occupation: '',
        position: '',
        institution: '',
        email: '',
        username: '',
        password: '',
        confirmPass: '',
    };

    // State
    state = {
        register: 'first',
        confirm_value: ''
    };

    // Check Email Uniqueness
    check_email = async (event) => {
        event.preventDefault();

        const response = await fetch('/auth/check-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: this.inputs.email }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            alert(data.message);
            return;
        }

        this.setState({ confirm_value: data.payload });

    }

    // Input Reference
    onChange_input = (event) => {
        this.inputs[event.target.name] = event.target.value;
    };

    // Next Form
    onNext = (event, key) => {
        event.preventDefault();

        return key === 'second'
            ? this.setState({ register: 'second' })
            : this.setState({ register: 'third' });
    };

    // Register account
    post_account = async (event) => {
        event.preventDefault();

        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: this.inputs.firstName,
                lastName: this.inputs.lastName,
                gender: this.inputs.gender,
                clientProfile: this.inputs.clientProfile,
                address: this.inputs.address,
                telephoneNum: this.inputs.telephoneNumber,
                cellphoneNum: this.inputs.cellphoneNumber,
                occupation: this.inputs.occupation,
                position: this.inputs.position,
                institution: this.inputs.institution,
                email: this.inputs.email,
                username: this.inputs.username,
                password: this.inputs.password,
                confirmPass: this.inputs.confirmPass,
            }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            alert(data.message);
            console.log(data.payload.error);

            if (response.status == 500) {
                this.setState({ register: 'first' });
                return;
            }

            this.setState({ register: 'third' });
            return;
        }

        alert(data.message);
        this.props.navigate('/login');
    };

    // Main Component
    render() {
        switch (this.state.register) {
            case 'first':
                return this.render_first();
            case 'second':
                return this.render_second();
            case 'third':
                return this.render_third();
        }
    }

    // First Register State
    render_first() {
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
                        <img
                            src={logo}
                            alt=""
                            className="rounded-full mb-3 h-14 w-14 md:h-20 md:w-20"
                        />
                        <h1 className="font-bold text-lg md:text-2xl text-center px-2">
                            FITS Tanza - Municipal Agriculture Office
                        </h1>
                    </div>
                    <div className="w-[95%] max-w-xs sm:max-w-sm md:max-w-md px-4 sm:px-6 md:px-10 py-6 space-y-6 rounded-lg shadow-lg border border-white/20 backdrop-blur-lg backdrop-brightness-95 bg-white shadow-black">
                        <h2 className="text-lg md:text-2xl font-bold text-center text-gray-800">
                            Register Now
                        </h2>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => this.onNext(e, 'second')}
                        >
                            <div>
                                <label
                                    htmlFor="fname"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="fname"
                                    name="firstName"
                                    onChange={this.onChange_input}
                                    required
                                    className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="lname"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lname"
                                    name="lastName"
                                    onChange={this.onChange_input}
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
                                            onChange={this.onChange_input}
                                            value="male"
                                            required
                                            className="form-radio text-blue-600"
                                        />
                                        <span className="ml-2 text-gray-700">
                                            Male
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            onChange={this.onChange_input}
                                            value="female"
                                            required
                                            className="form-radio text-blue-600"
                                        />
                                        <span className="ml-2 text-gray-700">
                                            Female
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            onChange={this.onChange_input}
                                            value="other"
                                            required
                                            className="form-radio text-blue-600"
                                        />
                                        <span className="ml-2 text-gray-700">
                                            Other
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500"
                            >
                                Next
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
                            <p className="mt-4 text-center text-sm text-gray-700">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-blue-600 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Second Register State
    render_second() {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
                <img
                    src={cover}
                    alt="Background"
                    className="fixed inset-0 w-full h-full object-cover opacity-60 blur-sm pointer-events-none"
                />
                <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-2 sm:px-8 py-8">
                    <div className="flex flex-col items-center justify-center mb-8 text-center">
                        <img
                            src={logo}
                            alt=""
                            className="rounded-full mb-6 h-20 w-20"
                        />
                        <h1 className="font-bold text-2xl px-2">
                            FITS Tanza - Municipal Agriculture Office
                        </h1>
                    </div>
                    <div className="w-full p-4 sm:p-8 space-y-6 bg-white rounded-lg shadow-lg border border-gray-300 bg-opacity-80 backdrop-blur-md max-w-md sm:max-w-full">
                        <h2 className="text-2xl font-bold text-center text-gray-800">
                            Register Now
                        </h2>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => this.onNext(e, 'third')}
                        >
                            <div>
                                <hr className="my-4 border-black-300" />
                                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                                    <label
                                        htmlFor="clientProfile"
                                        className="block text-sm font-medium text-black-700 w-full sm:w-40 mb-2 sm:mb-0"
                                    >
                                        Client Profile
                                    </label>
                                    <select
                                        id="clientProfile"
                                        onChange={this.onChange_input}
                                        name="clientProfile"
                                        required
                                        className="flex-1 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300 min-w-0 w-full sm:w-auto"
                                    >
                                        <option value="">Select profile</option>
                                        <option value="Fishfolk">
                                            Fishfolk
                                        </option>
                                        <option value="Rural_Based_Org">
                                            Rural Based Org
                                        </option>
                                        <option value="Student">Student</option>
                                        <option value="Agricultural_Fisheries_Technician">
                                            Agricultural/Fisheries Technician
                                        </option>
                                        <option value="Youth">Youth</option>
                                        <option value="Women">Women</option>
                                        <option value="Govt_Employee">
                                            Gov't Employee
                                        </option>
                                        <option value="PWD">PWD</option>
                                        <option value="Indigenous_People">
                                            Indigenous People
                                        </option>
                                        <option value="Other">
                                            Other
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="relative my-8">
                                <hr className="border-black-300" />
                                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white rounded-lg px-4 text-lg font-semibold text-gray-700">
                                    Contact Information
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-black-700 w-full sm:w-40 mb-2 sm:mb-0"
                                >
                                    Address :
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    onChange={this.onChange_input}
                                    name="address"
                                    required
                                    className="flex-1 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300 min-w-0 w-full sm:w-auto"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                                <label
                                    htmlFor="telephone"
                                    className="block text-sm font-medium text-black-700 w-full sm:w-40 mb-2 sm:mb-0"
                                >
                                    Telephone No :
                                </label>
                                <input
                                    type="tel"
                                    id="telephone"
                                    onChange={this.onChange_input}
                                    required
                                    name="telephoneNumber"
                                    className="flex-1 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300 min-w-0 w-full sm:w-auto"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                                <label
                                    htmlFor="cellphone"
                                    className="block text-sm font-medium text-black-700 w-full sm:w-40 mb-2 sm:mb-0"
                                >
                                    Cellphone No :
                                </label>
                                <input
                                    type="tel"
                                    id="cellphone"
                                    onChange={this.onChange_input}
                                    name="cellphoneNumber"
                                    required
                                    className="flex-1 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300 min-w-0 w-full sm:w-auto"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                                <label
                                    htmlFor="occupation"
                                    className="block text-sm font-medium text-black-700 w-full sm:w-40 mb-2 sm:mb-0"
                                >
                                    Occupation :
                                </label>
                                <input
                                    type="text"
                                    id="occupation"
                                    onChange={this.onChange_input}
                                    required
                                    name="occupation"
                                    className="flex-1 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300 min-w-0 w-full sm:w-auto"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                                <label
                                    htmlFor="position"
                                    className="block text-sm font-medium text-black-700 w-full sm:w-40 mb-2 sm:mb-0"
                                >
                                    Position :
                                </label>
                                <input
                                    type="text"
                                    id="position"
                                    onChange={this.onChange_input}
                                    required
                                    name="position"
                                    className="flex-1 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300 min-w-0 w-full sm:w-auto"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                                <label
                                    htmlFor="institution"
                                    className="block text-sm font-medium text-black-700 w-full sm:w-40 mb-2 sm:mb-0"
                                >
                                    Institution :
                                </label>
                                <input
                                    type="text"
                                    id="institution"
                                    onChange={this.onChange_input}
                                    required
                                    name="institution"
                                    className="flex-1 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300 min-w-0 w-full sm:w-auto"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-black-700 w-full sm:w-40 mb-2 sm:mb-0"
                                >
                                    Email Address :
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    onChange={this.onChange_input}
                                    name="email"
                                    required
                                    className="flex-1 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-black-300 min-w-0 w-full sm:w-auto"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 mt-5 focus:ring-4 focus:ring-blue-500"
                            >
                                Next
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Third Register State
    render_third() {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-100 overflow-hidden min-h-screen">
            <img
                src={cover}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm"
            />

            {/* Custom Alert */}
            {this.state.alert && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
                <div className="bg-white rounded-lg shadow-xl px-8 py-6 max-w-xs w-full text-center border border-blue-200 animate-fade-in">
                    <div className="mb-3">
                    {this.state.alertType === "error" ? (
                        <svg className="mx-auto h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="mx-auto h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${this.state.alertType === "error" ? "text-red-600" : "text-green-600"}`}>
                    {this.state.alertTitle}
                    </h3>
                    <p className="text-gray-700 mb-4">{this.state.alertMsg}</p>
                    <button
                    className={`px-4 py-2 rounded-md font-medium shadow transition ${
                        this.state.alertType === "error"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                    onClick={() => {
                        this.setState({ alert: false });
                        if (this.state.alertType === "success") {
                        this.props.navigate('/login');
                        }
                    }}
                    >
                    OK
                    </button>
                </div>
                </div>
            )}

            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                <div className="flex flex-col items-center justify-center mb-6 text-center">
                <img
                    src={logo}
                    alt=""
                    className="rounded-full mb-4 h-16 w-16 sm:h-20 sm:w-20"
                />
                <h1 className="px-4 font-bold text-lg sm:text-2xl text-center">
                    FITS Tanza - Municipal Agriculture Office
                </h1>
                </div>

                <div className="w-full max-w-xs sm:max-w-md p-6 sm:p-8 space-y-6 bg-white rounded-lg shadow-lg border border-gray-300 backdrop-blur-md bg-opacity-70">
                <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
                    Register Now
                </h2>
                <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                    e.preventDefault();
                    if (this.inputs.password !== this.inputs.confirmPass) {
                        this.setState({
                        alert: true,
                        alertType: "error",
                        alertTitle: "Password Mismatch",
                        alertMsg: "Passwords do not match. Please try again.",
                        });
                        return;
                    }
                    // Call original post_account
                    const response = await fetch('/api/Authentication/register', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                        firstName: this.inputs.firstName,
                        lastName: this.inputs.lastName,
                        gender: this.inputs.gender,
                        clientProfile: this.inputs.clientProfile,
                        address: this.inputs.address,
                        telephoneNum: this.inputs.telephoneNumber,
                        cellphoneNum: this.inputs.cellphoneNumber,
                        occupation: this.inputs.occupation,
                        position: this.inputs.position,
                        institution: this.inputs.institution,
                        email: this.inputs.email,
                        username: this.inputs.username,
                        password: this.inputs.password,
                        confirmPass: this.inputs.confirmPass,
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        this.setState({
                        alert: true,
                        alertType: "error",
                        alertTitle: "Registration Failed",
                        alertMsg: data.message || "An error occurred. Please try again.",
                        });
                        if (response.status == 500) {
                        this.setState({ register: 'first' });
                        } else {
                        this.setState({ register: 'third' });
                        }
                        return;
                    }

                    this.setState({
                        alert: true,
                        alertType: "success",
                        alertTitle: "Account Created",
                        alertMsg: "Your account has been successfully created!",
                    });
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
                        id="email"
                        name="username"
                        onChange={this.onChange_input}
                        required
                        className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
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
                        onChange={this.onChange_input}
                        name="password"
                        required
                        className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                    />
                    </div>

                    <div>
                    <label
                        htmlFor="confirmPass"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPass"
                        onChange={(e) => {
                        this.inputs.confirmPass = e.target.value;
                        this.setState({ ...this.state, confirm_value: e.target.value });
                        }}
                        value={this.state.confirm_value}
                        name="confirmPass"
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
                    <label
                        htmlFor="remember"
                        className="ml-2 block text-sm text-gray-900"
                    >
                        Remember me
                    </label>
                    </div>

                    <button
                    type="submit"
                    className="w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500"
                    >
                    Register
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-700">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Sign in
                    </Link>
                    </p>
                </form>
                </div>
            </div>
            </div>
        );
    }
}

export default register_wrapper;
