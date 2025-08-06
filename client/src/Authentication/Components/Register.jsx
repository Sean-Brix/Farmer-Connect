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
        email_prompt: ''
    };

    steps = [
        { label: 'Personal Info' },
        { label: 'Contact Info' },
        { label: 'Account Details' },
    ];

    check_email = async (event) => {
        event.preventDefault();
        const response = await fetch('/auth/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.inputs.email }),
        });
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 400) {
                this.setState({ checkEmail: false, email_prompt: 'Invalid Email Address' });
                this.inputs.email = '';
                return;
            }
            if (response.status === 409) {
                this.setState({ checkEmail: false, email_prompt: 'Email Already Exist' });
                this.inputs.email = '';
                return;
            }
            if (response.status === 500) {
                alert('Something went wrong. Please try again later.');
                this.setState({ register: 'first' });
                this.props.navigate('/login');
                return;
            }
            return;
        }
        if (data.result) {
            this.setState({ checkEmail: true, email_prompt: 'Yan okay na email' });
            return;
        }
        this.setState({ checkEmail: false });
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
            <div className="min-h-screen flex items-center justify-center px-2 py-6 sm:py-10" style={{
                backgroundImage: `url(${ebg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
                <div className="relative flex flex-col md:flex-row w-full max-w-5xl md:h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                    {/* Left: Form Section, scrollable if needed */}
                    <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-8 md:py-10 z-10 max-h-[90vh] md:max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                        {/* FITS Tanza Branding at the top, matching Login */}
                        <div className="flex flex-col items-center mb-8 mt-15 ">
                            <img src={logo} alt="FITS Tanza Logo" className="h-12 w-12 rounded-full mb-3 shadow-xl  z-30 relative mt-5" />
                            <h1 className="font-extrabold text-3xl md:text-4xl text-blue-700 tracking-tight mb-1 text-center drop-shadow font-sans uppercase" style={{letterSpacing: '0.04em'}}>FITS - Tanza</h1>
                            <span className="text-sm md:text-sm font-semibold text-blue-600 tracking-wide mb-2 text-center" style={{textShadow: '0 2px 8px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.07)'}}>Municipal Agriculture Office</span>
                            <span className="text-gray-500 text-base md:text-lg text-center">Create your account</span>
                        </div>
                        {/* Stepper with modern progress line */}
                        <div className="relative flex items-center mb-5 w-full max-w-md mx-auto">
                            {/* Modern Progress Bar */}
                            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded-full shadow-inner z-0" style={{ transform: 'translateY(-50%)' }} />
                            <div className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg z-10 transition-all duration-500" style={{ width: `${(stepIndex) / (this.steps.length - 1) * 100}%`, transform: 'translateY(-50%)' }} />
                            {/* Step Circles */}
                            {this.steps.map((step, idx) => (
                                <div key={step.label} className="relative flex-1 flex flex-col items-center z-20">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 transition-all duration-300 shadow-md ${idx < stepIndex ? 'border-blue-600 bg-blue-600 text-white' : idx === stepIndex ? 'border-blue-600 bg-white text-blue-700 font-bold' : 'border-gray-300 bg-white text-gray-400'}`}>{idx + 1}</div>
                                    <span className={`mt-2 text-xs md:text-sm text-center ${idx < stepIndex ? 'text-blue-600' : idx === stepIndex ? 'text-blue-700 font-semibold' : 'text-gray-400'}`}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="w-full max-w-md mx-auto flex flex-col min-h-[350px]">
                            {/* Form content, push button to bottom if needed */}
                            <div className="flex-1 flex flex-col justify-between">
                                {register === 'first' && this.render_first()}
                                {register === 'second' && this.render_second()}
                                {register === 'third' && this.render_third()}
                            </div>
                        </div>
                    </div>
                    {/* Right: Image section matching Login layout */}
                    <div className="hidden md:block relative w-1/2 h-[80dvh] justify-self-center bg-transparent">
                        <div className="flex items-center justify-center w-full h-full">
                            <div className="relative w-[95%] h-[95%] flex items-center justify-center">
                                <img
                                    src={i1}
                                    alt="side"
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
            </div>
        );
    }

    render_first() {
        return (
            <form className="space-y-5" onSubmit={(e) => this.onNext(e, 'second')}>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create new account<span className="text-blue-600">.</span></h2>
                <p className="text-gray-400 text-sm mb-4">Already A Member? <Link to="/login" className="text-blue-600 hover:underline">Log In</Link></p>
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <label htmlFor="fname" className="block text-xs font-semibold text-gray-500 mb-1">First name</label>
                        <input type="text" id="fname" name="firstName" onChange={this.onChange_input} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="lname" className="block text-xs font-semibold text-gray-500 mb-1">Last name</label>
                        <input type="text" id="lname" name="lastName" onChange={this.onChange_input} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Gender</label>
                    <div className="flex space-x-6 mt-1">
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="gender" value="Male" onChange={this.onChange_input} required className="accent-blue-600" />
                            <span className="ml-2 text-gray-700">Male</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="gender" value="Female" onChange={this.onChange_input} required className="accent-blue-600" />
                            <span className="ml-2 text-gray-700">Female</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="gender" value="Other" onChange={this.onChange_input} required className="accent-blue-600" />
                            <span className="ml-2 text-gray-700">Other</span>
                        </label>
                    </div>
                </div>
                <button type="submit" className="w-full py-3 mt-4  text-white bg-blue-600 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Next</button>
            </form>
        );
    }

    render_second() {
        return (
            <form className="space-y-6" onSubmit={(e) => this.onNext(e, 'third')}>
                <div>
                    <label htmlFor="clientProfile" className="block text-xs font-semibold text-gray-500 mb-1">Client Profile</label>
                    <select id="clientProfile" name="clientProfile" onChange={this.onChange_input} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50">
                        <option value="">Select profile</option>
                        <option value="Fishfolk">Fishfolk</option>
                        <option value="Rural_Based_Org">Rural Based Org</option>
                        <option value="Student">Student</option>
                        <option value="Agricultural_Fisheries_Technician">Agricultural/Fisheries Technician</option>
                        <option value="Youth">Youth</option>
                        <option value="Women">Women</option>
                        <option value="Govt_Employee">Gov't Employee</option>
                        <option value="PWD">PWD</option>
                        <option value="Indigenous_People">Indigenous People</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                        <input type="email" id="email" name="email" onChange={(e) => { this.onChange_input(e); clearTimeout(this.emailCheckTimeout); this.emailCheckTimeout = setTimeout(() => { this.check_email(e); }, 500); }} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                        {this.state.email_prompt && (
                            <p className={`mt-1 text-xs ${this.state.checkEmail ? 'text-green-500' : 'text-red-500'}`}>{this.state.email_prompt}</p>
                        )}
                    </div>
                </div>
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <label htmlFor="address" className="block text-xs font-semibold text-gray-500 mb-1">Address</label>
                        <input type="text" id="address" name="address" onChange={this.onChange_input} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                    </div>
                </div>
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <label htmlFor="telephone" className="block text-xs font-semibold text-gray-500 mb-1">Telephone No</label>
                        <input type="tel" id="telephone" name="telephoneNumber" onChange={this.onChange_input} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="cellphone" className="block text-xs font-semibold text-gray-500 mb-1">Cellphone No</label>
                        <input type="tel" id="cellphone" name="cellphoneNumber" onChange={this.onChange_input} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                    </div>
                </div>
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <label htmlFor="occupation" className="block text-xs font-semibold text-gray-500 mb-1">Occupation</label>
                        <input type="text" id="occupation" name="occupation" onChange={this.onChange_input} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="position" className="block text-xs font-semibold text-gray-500 mb-1">Position</label>
                        <input type="text" id="position" name="position" onChange={this.onChange_input} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                    </div>
                </div>
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <label htmlFor="institution" className="block text-xs font-semibold text-gray-500 mb-1">Institution</label>
                        <input type="text" id="institution" name="institution" onChange={this.onChange_input} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                    </div>
                </div>
                <button type="submit" className="w-full py-3 mt-4 mb-6 text-white bg-blue-600 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Next</button>
            </form>
        );
    }

    render_third() {
        return (
            <form className="space-y-6" onSubmit={this.post_account}>
                <div>
                    <label htmlFor="username" className="block text-xs font-semibold text-gray-500 mb-1">Username</label>
                    <input type="text" id="username" name="username" onChange={this.onChange_input} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-xs font-semibold text-gray-500 mb-1">Password</label>
                    <input type="password" id="password" name="password" onChange={this.onChange_input} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                </div>
                <div>
                    <label htmlFor="confirmPass" className="block text-xs font-semibold text-gray-500 mb-1">Confirm Password</label>
                    <input type="password" id="confirmPass" name="confirmPass" value={this.state.confirm_value} onChange={(e) => { this.inputs.confirmPass = e.target.value; this.setState({ ...this.state, confirm_value: e.target.value }); }} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                </div>
                <button type="submit" className="w-full py-3 mt-4 text-white bg-blue-600 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Create account</button>
            </form>
        );
    }
}

export default register_wrapper;
