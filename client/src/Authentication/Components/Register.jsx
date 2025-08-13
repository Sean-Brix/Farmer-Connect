import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import i1 from '../Assets/people.jpg';
import logo from '../../Assets/Logo.png';
import ebg from '../Assets/elementbg.jpg';

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

    state = {
        register: 'first',
        confirm_value: '',
        checkEmail: false,
        email_prompt: '',
        showPassword: false,
        showConfirmPassword: false,
        email_value: ''
    };

    steps = [
        { label: 'Personal Info' },
        { label: 'Contact Info' },
        { label: 'Account Details' },
    ];

    check_email = async (event) => {
        const email = event.target.value;
        
        // Don't validate empty emails
        if (!email || email.trim() === '') {
            this.setState({ checkEmail: false, email_prompt: '' });
            return;
        }

        try {
            const response = await fetch('/auth/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email }),
            });
            const data = await response.json();
            
            if (!response.ok) {
                if (response.status === 400) {
                    this.setState({ checkEmail: false, email_prompt: 'Invalid Email Address' });
                    return;
                }
                if (response.status === 409) {
                    this.setState({ checkEmail: false, email_prompt: 'Email Already Exists' });
                    return;
                }
                if (response.status === 500) {
                    this.setState({ checkEmail: false, email_prompt: 'Server error. Please try again.' });
                    return;
                }
                return;
            }
            
            if (data.result) {
                this.setState({ checkEmail: true, email_prompt: 'Email is available!' });
                return;
            }
            
            this.setState({ checkEmail: false, email_prompt: 'Email validation failed' });
        } catch (error) {
            console.error('Email validation error:', error);
            this.setState({ checkEmail: false, email_prompt: 'Network error. Please check your connection.' });
        }
    };

    onChange_input = async (event) => {
        this.inputs[event.target.name] = event.target.value;
    };

    onNext = (event, key) => {
        event.preventDefault();
        return key === 'second'
            ? this.setState({ register: 'second' })
            : this.setState({ register: 'third' });
    };

    post_account = async (event) => {
        event.preventDefault();
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            if (response.status == 400) {
                if (data.error === 'required') {
                    alert('All fields are required. Please fill in all fields.');
                    return;
                }
                if (data.error === 'password') {
                    alert('Passwords do not match. Please try again.');
                    return;
                }
                if (data.error === 'password-long') {
                    alert('Password must be at least 6 characters long.');
                    return;
                }
                if (data.error === 'email_format') {
                    alert('Invalid email format. Please enter a valid email address.');
                    return;
                }
                if (data.error === 'username-short') {
                    alert('Username must be at least 3 characters long.');
                    return;
                }
                if (data.error === 'username-letters') {
                    alert('Username can only contain letters and numbers.');
                    return;
                }
            }
            if (response.status == 409) {
                if (data.error === 'username') {
                    alert('Username already exists. Please choose another one.');
                    return;
                }
                if (data.error === 'email') {
                    alert('Email already exists. Please choose another one.');
                    return;
                }
            }
            if (response.status == 500) {
                this.setState({ register: 'first' });
                alert('something went wrong. Please try again later.');
                return;
            }
            return;
        }
        alert('Account Registered');
        this.props.navigate('/login');
    };

    render() {
        const { register } = this.state;
        let stepIndex = 0;
        if (register === 'second') stepIndex = 1;
        if (register === 'third') stepIndex = 2;
        return (
            <div className="min-h-screen flex items-center justify-center px-3 py-8" style={{
                backgroundImage: `url(${ebg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
                <div className="relative flex flex-col lg:flex-row w-full max-w-6xl lg:h-[700px] bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20" style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'}}>
                    {/* Left: Form Section, scrollable if needed */}
                    <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-10 lg:py-12 z-10 max-h-[90vh] lg:max-h-[700px] overflow-y-auto custom-scrollbar">
                    {/* Custom Scrollbar Styles */}
                    <style>{`
                       .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
                    border-radius: 12px;
                    border: 2px solid rgba(255,255,255,0.1);
                    box-shadow: 0 4px 12px rgba(34,197,94,0.15);
                    min-height: 40px;
                    transition: all 0.3s ease;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                    border: 2px solid rgba(255,255,255,0.2);
                    transform: scale(1.1);
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(187,247,208,0.1);
                    border-radius: 12px;
                    margin: 4px;
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #22c55e rgba(187,247,208,0.1);
                }
                    `}</style>
                        {/* FITS Tanza Branding at the top, matching Login */}
                        <div className="flex flex-col items-center mb-10 mt-6">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-lg opacity-30 scale-110"></div>
                                <img src={logo} alt="FITS Tanza Logo" className="relative h-16 w-16 rounded-full shadow-2xl border-4 border-white/80" />
                            </div>
                            <div className="text-center space-y-3">
                                <h1 className="font-black text-4xl lg:text-5xl bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 bg-clip-text text-transparent tracking-tight drop-shadow-sm font-sans uppercase" style={{letterSpacing: '0.02em'}}>FITS - Tanza</h1>
                                <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto shadow-lg"></div>
                                <p className="text-lg font-semibold text-green-700/90 tracking-wide" style={{textShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>Municipal Agriculture Office</p>
                                <p className="text-gray-600 text-lg font-medium">Create your professional account</p>
                            </div>
                        </div>
                        {/* Stepper with modern progress line */}
                        <div className="relative flex items-center mb-8 w-full max-w-lg mx-auto">
                            {/* Modern Progress Bar */}
                            <div className="absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-gray-100 via-gray-150 to-gray-100 rounded-full shadow-inner border border-gray-200/50" style={{ transform: 'translateY(-50%)' }} />
                            <div className="absolute top-1/2 left-0 h-3 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full shadow-lg border border-green-400/30 transition-all duration-700 ease-out" style={{ width: `${(stepIndex) / (this.steps.length - 1) * 100}%`, transform: 'translateY(-50%)', boxShadow: '0 4px 14px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.3)' }} />
                            {/* Step Circles */}
                            {this.steps.map((step, idx) => (
                                <div key={step.label} className="relative flex-1 flex flex-col items-center z-20">
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-500 shadow-lg font-bold text-sm ${idx < stepIndex ? 'border-green-600 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-200' : idx === stepIndex ? 'border-green-600 bg-white text-green-700 shadow-green-300 ring-4 ring-green-100' : 'border-gray-300 bg-white text-gray-400 shadow-gray-200'}`} style={{boxShadow: idx === stepIndex ? '0 8px 25px rgba(34,197,94,0.25), 0 0 0 4px rgba(34,197,94,0.1)' : undefined}}>{idx + 1}</div>
                                    <span className={`mt-3 text-sm font-semibold text-center transition-colors duration-300 ${idx < stepIndex ? 'text-green-600' : idx === stepIndex ? 'text-green-700' : 'text-gray-400'}`}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="w-full max-w-lg mx-auto flex flex-col min-h-[400px]">
                            {/* Form content, push button to bottom if needed */}
                            <div className="flex-1 flex flex-col justify-between">
                                {register === 'first' && this.render_first()}
                                {register === 'second' && this.render_second()}
                                {register === 'third' && this.render_third()}
                            </div>
                        </div>
                    </div>
                    {/* Right: Image section matching Login layout */}
                    <div className="hidden lg:block relative w-1/2 h-[85vh] lg:h-[700px] bg-gradient-to-br from-green-50 to-emerald-50">
                        <div className="flex items-center justify-center w-full h-full p-8">
                            <div className="relative w-full h-full flex items-center justify-center">
                                <div className="absolute inset-4 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-[140px] blur-2xl"></div>
                                <img
                                    src={i1}
                                    alt="Agricultural professionals"
                                    className="relative w-[90%] h-[90%] object-cover rounded-[140px] shadow-2xl border-8 border-white/50"
                                    style={{objectPosition: 'center top', boxShadow: '0 35px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.9)'}} 
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-4 rounded-[140px] bg-gradient-to-br from-green-600/30 via-transparent to-emerald-800/40 pointer-events-none"></div>
                                {/* Decorative Elements */}
                                <div className="absolute top-8 right-8 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 blur-xl"></div>
                                <div className="absolute bottom-8 left-8 w-32 h-32 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-15 blur-2xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render_first() {
        return (
            <form className="space-y-8" onSubmit={(e) => this.onNext(e, 'second')}>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">Personal Information</h2>
                    <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-600 text-base font-medium">Tell us about yourself</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label htmlFor="fname" className="block text-sm font-semibold text-gray-700 tracking-wide">First Name</label>
                        <input 
                            type="text" 
                            id="fname" 
                            name="firstName" 
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="off"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md font-medium placeholder-gray-400"
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="lname" className="block text-sm font-semibold text-gray-700 tracking-wide">Last Name</label>
                        <input 
                            type="text" 
                            id="lname" 
                            name="lastName" 
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="off"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md font-medium placeholder-gray-400"
                            placeholder="Enter your last name"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 tracking-wide">Gender</label>
                    <div className="grid grid-cols-3 gap-4">
                        <label className="relative flex items-center justify-center py-4 px-5 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                            <input type="radio" name="gender" value="Male" onChange={this.onChange_input} required className="sr-only" />
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full group-hover:border-green-500 flex items-center justify-center transition-all duration-300">
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors duration-300">Male</span>
                            </div>
                        </label>
                        <label className="relative flex items-center justify-center py-4 px-5 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                            <input type="radio" name="gender" value="Female" onChange={this.onChange_input} required className="sr-only" />
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full group-hover:border-green-500 flex items-center justify-center transition-all duration-300">
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors duration-300">Female</span>
                            </div>
                        </label>
                        <label className="relative flex items-center justify-center py-4 px-5 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                            <input type="radio" name="gender" value="Other" onChange={this.onChange_input} required className="sr-only" />
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full group-hover:border-green-500 flex items-center justify-center transition-all duration-300">
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors duration-300">Other</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="pt-6">
                    <button type="submit" className="w-full py-5 text-white bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group text-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                            <span>Continue to Contact Info</span>
                            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </button>
                </div>

                <div className="text-center pt-6 border-t border-gray-200/60">
                    <p className="text-sm text-gray-500 font-medium">Already have an account? 
                        <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold ml-2 hover:underline transition-all duration-300 relative">
                            Sign in here
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </p>
                </div>
            </form>
        );
    }

    render_second() {
        return (
            <form className="space-y-8" onSubmit={(e) => this.onNext(e, 'third')}>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">Contact & Professional Info</h2>
                    <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-600 text-base font-medium">Help us understand your background</p>
                </div>

                <div className="space-y-3">
                    <label htmlFor="clientProfile" className="block text-sm font-semibold text-gray-700 tracking-wide">Client Profile</label>
                    <div className="relative">
                        <select 
                            id="clientProfile" 
                            name="clientProfile" 
                            onChange={this.onChange_input} 
                            required 
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md appearance-none font-medium text-gray-700"
                        >
                            <option value="">Select your profile</option>
                            <option value="Fishfolk">Fishfolk</option>
                            <option value="Rural_Based_Org">Rural Based Organization</option>
                            <option value="Student">Student</option>
                            <option value="Agricultural_Fisheries_Technician">Agricultural/Fisheries Technician</option>
                            <option value="Youth">Youth</option>
                            <option value="Women">Women</option>
                            <option value="Govt_Employee">Government Employee</option>
                            <option value="PWD">Person with Disability</option>
                            <option value="Indigenous_People">Indigenous People</option>
                            <option value="Other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 tracking-wide">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={this.state.email_value}
                            onChange={(e) => { 
                                this.setState({ email_value: e.target.value });
                                this.inputs.email = e.target.value;
                                // Clear any previous validation messages when user starts typing
                                if (this.state.email_prompt) {
                                    this.setState({ email_prompt: '', checkEmail: false });
                                }
                                clearTimeout(this.emailCheckTimeout); 
                                this.emailCheckTimeout = setTimeout(() => { 
                                    if (e.target.value.trim() !== '') {
                                        this.check_email(e); 
                                    }
                                }, 1000); 
                            }} 
                            required 
                            autoComplete="off"
                            className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md font-medium placeholder-gray-400"
                            placeholder="your.email@example.com"
                        />
                    </div>
                    {this.state.email_prompt && (
                        <div className={`flex items-center space-x-3 mt-3 p-3 rounded-xl backdrop-blur-sm ${this.state.checkEmail ? 'text-green-700 bg-green-50/80 border border-green-200' : 'text-red-700 bg-red-50/80 border border-red-200'}`}>
                            {this.state.checkEmail ? (
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            <span className="text-sm font-semibold">{this.state.email_prompt}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 tracking-wide">Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            id="address" 
                            name="address" 
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="off"
                            className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md font-medium placeholder-gray-400"
                            placeholder="Enter your complete address"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label htmlFor="telephone" className="block text-sm font-semibold text-gray-700 tracking-wide">Telephone No.</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <input 
                                type="tel" 
                                id="telephone" 
                                name="telephoneNumber" 
                                onChange={this.onChange_input} 
                                required 
                                autoComplete="off"
                                className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md font-medium placeholder-gray-400"
                                placeholder="(02) 123-4567"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="cellphone" className="block text-sm font-semibold text-gray-700 tracking-wide">Mobile No.</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input 
                                type="tel" 
                                id="cellphone" 
                                name="cellphoneNumber" 
                                onChange={this.onChange_input} 
                                required 
                                autoComplete="off"
                                className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md font-medium placeholder-gray-400"
                                placeholder="+63 912 345 6789"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label htmlFor="occupation" className="block text-sm font-semibold text-gray-700 tracking-wide">Occupation</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2M8 6v2a2 2 0 01-2 2m0 0H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-2m-8 0V8a2 2 0 012-2h4a2 2 0 012 2v8M8 12h.01" />
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                id="occupation" 
                                name="occupation" 
                                onChange={this.onChange_input} 
                                required 
                                autoComplete="off"
                                className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md font-medium placeholder-gray-400"
                                placeholder="Your occupation"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="position" className="block text-sm font-semibold text-gray-700 tracking-wide">Position</label>
                        <input 
                            type="text" 
                            id="position" 
                            name="position" 
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="off"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md font-medium placeholder-gray-400"
                            placeholder="Your position/title"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label htmlFor="institution" className="block text-sm font-semibold text-gray-700 tracking-wide">Institution/Organization</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            id="institution" 
                            name="institution" 
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="off"
                            className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md font-medium placeholder-gray-400"
                            placeholder="Your institution or organization"
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <button type="submit" className="w-full py-5 text-white bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group text-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                            <span>Continue to Account Setup</span>
                            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </button>
                </div>
            </form>
        );
    }

    render_third() {
        return (
            <form className="space-y-8" onSubmit={this.post_account}>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">Create Your Account</h2>
                    <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-600 text-base font-medium">Almost done! Set up your login credentials</p>
                </div>

                <div className="space-y-3">
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 tracking-wide">Username</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="off"
                            className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md font-medium placeholder-gray-400"
                            placeholder="Choose a unique username"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 tracking-wide">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input 
                            type={this.state.showPassword ? "text" : "password"} 
                            id="password" 
                            name="password" 
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="new-password"
                            className="w-full pl-14 pr-14 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md font-medium placeholder-gray-400"
                            placeholder="Create a strong password"
                        />
                        <button
                            type="button"
                            onClick={() => this.setState({ showPassword: !this.state.showPassword })}
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700 transition-colors duration-300 group"
                        >
                            {this.state.showPassword ? (
                                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="text-sm text-gray-500 font-medium mt-2 flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Password must be at least 6 characters long</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <label htmlFor="confirmPass" className="block text-sm font-semibold text-gray-700 tracking-wide">Confirm Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <input 
                            type={this.state.showConfirmPassword ? "text" : "password"} 
                            id="confirmPass" 
                            name="confirmPass" 
                            value={this.state.confirm_value} 
                            onChange={(e) => { 
                                this.inputs.confirmPass = e.target.value; 
                                this.setState({ ...this.state, confirm_value: e.target.value }); 
                            }} 
                            required 
                            autoComplete="new-password"
                            className="w-full pl-14 pr-14 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md font-medium placeholder-gray-400"
                            placeholder="Confirm your password"
                        />
                        <button
                            type="button"
                            onClick={() => this.setState({ showConfirmPassword: !this.state.showConfirmPassword })}
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700 transition-colors duration-300 group"
                        >
                            {this.state.showConfirmPassword ? (
                                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="pt-8">
                    <button type="submit" className="w-full py-5 text-white bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group text-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                            <svg className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Create My Professional Account</span>
                        </div>
                    </button>
                </div>

                <div className="text-center pt-6 border-t border-gray-200/60">
                    <p className="text-sm text-gray-500 font-medium">Already have an account? 
                        <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold ml-2 hover:underline transition-all duration-300 relative">
                            Sign in here
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </p>
                </div>
            </form>
        );
    }
}

export default register_wrapper;
