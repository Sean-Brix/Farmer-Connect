import React, { Component } from 'react';

class RegisterUserModal extends Component {
    // Fields - using state instead of class property to persist data
    state = {
        inputs: {
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
        },
        register: 'first',
        confirm_value: '',
        checkEmail: false,
        email_prompt: '',
        isLoading: false
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
            body: JSON.stringify({ email: this.state.inputs.email }),
        });
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 400) {
                this.setState({ 
                    checkEmail: false, 
                    email_prompt: 'Invalid Email Address',
                    inputs: { ...this.state.inputs, email: '' }
                });
                return;
            }
            if (response.status === 409) {
                this.setState({ 
                    checkEmail: false, 
                    email_prompt: 'Email Already Exist',
                    inputs: { ...this.state.inputs, email: '' }
                });
                return;
            }
            if (response.status === 500) {
                alert('Something went wrong. Please try again later.');
                this.setState({ register: 'first' });
                this.props.onClose();
                return;
            }
            return;
        }
        if (data.result) {
            this.setState({ checkEmail: true, email_prompt: 'Email is available' });
            return;
        }
        this.setState({ checkEmail: false });
    };

    onChange_input = async (event) => {
        const { name, value } = event.target;
        this.setState({
            inputs: {
                ...this.state.inputs,
                [name]: value
            }
        });
    };

    onNext = (event, key) => {
        event.preventDefault();
        return key === 'second'
            ? this.setState({ register: 'second' })
            : this.setState({ register: 'third' });
    };

    onBack = (event) => {
        event.preventDefault();
        const { register } = this.state;
        if (register === 'second') {
            this.setState({ register: 'first' });
        } else if (register === 'third') {
            this.setState({ register: 'second' });
        }
    };

    post_account = async (event) => {
        event.preventDefault();
        this.setState({ isLoading: true });
        
        const { inputs } = this.state;
        const response = await fetch('/api/account/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({
                firstName: inputs.firstName,
                lastName: inputs.lastName,
                gender: inputs.gender,
                clientProfile: inputs.clientProfile,
                address: inputs.address,
                telephoneNum: inputs.telephoneNumber,
                cellphoneNum: inputs.cellphoneNumber,
                occupation: inputs.occupation,
                position: inputs.position,
                institution: inputs.institution,
                email: inputs.email,
                username: inputs.username,
                password: inputs.password,
                confirmPass: inputs.confirmPass,
            }),
        });
        
        this.setState({ isLoading: false });
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
            if (response.status == 401) {
                alert('Unauthorized. Admin access required.');
                return;
            }
            if (response.status == 500) {
                this.setState({ register: 'first' });
                alert('Something went wrong. Please try again later.');
                return;
            }
            return;
        }
        
        alert('Account registered successfully!');
        this.props.onSuccess();
        this.props.onClose();
    };

    resetForm = () => {
        this.setState({
            inputs: {
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
            },
            register: 'first',
            confirm_value: '',
            checkEmail: false,
            email_prompt: '',
            isLoading: false
        });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.open !== this.props.open && this.props.open) {
            this.resetForm();
        }
    }

    render() {
        const { open, onClose } = this.props;
        const { register, isLoading, inputs } = this.state;
        
        if (!open) return null;

        let stepIndex = 0;
        if (register === 'second') stepIndex = 1;
        if (register === 'third') stepIndex = 2;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80  transition-opacity">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-4xl w-full mx-6 relative max-h-[95vh] flex flex-col border border-white/20" style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'}}>
                    <button
                        onClick={() => {
                            this.resetForm();
                            onClose();
                        }}
                        className="absolute top-6 right-6 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition-all duration-300 group focus:outline-none z-10"
                        aria-label="Close"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 group-hover:scale-110 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    
                    <div className="p-10 overflow-y-auto" style={{ maxHeight: '85vh', fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-lg opacity-30 scale-110"></div>
                                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-full h-full flex items-center justify-center shadow-xl">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">Register New User</h2>
                                <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto shadow-lg"></div>
                                <p className="text-gray-600 text-lg font-medium">Create a professional account for the system</p>
                            </div>
                        </div>

                        {/* Stepper */}
                        <div className="relative flex items-center mb-10 w-full max-w-2xl mx-auto">
                            <div className="absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-gray-100 via-gray-150 to-gray-100 rounded-full shadow-inner border border-gray-200/50" style={{ transform: 'translateY(-50%)' }} />
                            <div className="absolute top-1/2 left-0 h-3 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full shadow-lg border border-green-400/30 transition-all duration-700 ease-out" style={{ width: `${(stepIndex) / (this.steps.length - 1) * 100}%`, transform: 'translateY(-50%)', boxShadow: '0 4px 14px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.3)' }} />
                            
                            {this.steps.map((step, idx) => (
                                <div key={step.label} className="relative flex-1 flex flex-col items-center z-20">
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-500 shadow-lg font-bold text-sm ${idx < stepIndex ? 'border-green-600 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-200' : idx === stepIndex ? 'border-green-600 bg-white text-green-700 shadow-green-300 ring-4 ring-green-100' : 'border-gray-300 bg-white text-gray-400 shadow-gray-200'}`} style={{boxShadow: idx === stepIndex ? '0 8px 25px rgba(34,197,94,0.25), 0 0 0 4px rgba(34,197,94,0.1)' : undefined}}>
                                        {idx + 1}
                                    </div>
                                    <span className={`mt-3 text-sm font-semibold text-center transition-colors duration-300 ${idx < stepIndex ? 'text-green-600' : idx === stepIndex ? 'text-green-700' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Form Content */}
                        <div className="w-full max-w-3xl mx-auto">
                            {register === 'first' && this.render_first()}
                            {register === 'second' && this.render_second()}
                            {register === 'third' && this.render_third()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render_first() {
        const { inputs } = this.state;
        return (
            <form className="space-y-8" onSubmit={(e) => this.onNext(e, 'second')}>
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">Personal Information</h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-600 font-medium">Enter the user's basic information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label htmlFor="fname" className="block text-sm font-bold text-gray-700 tracking-wide">First Name</label>
                        <input 
                            type="text" 
                            id="fname" 
                            name="firstName" 
                            value={inputs.firstName}
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="off"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium placeholder-gray-400 text-gray-700"
                            placeholder="Enter first name"
                        />
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="lname" className="block text-sm font-bold text-gray-700 tracking-wide">Last Name</label>
                        <input 
                            type="text" 
                            id="lname" 
                            name="lastName" 
                            value={inputs.lastName}
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="off"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium placeholder-gray-400 text-gray-700"
                            placeholder="Enter last name"
                        />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 tracking-wide">Gender</label>
                    <div className="grid grid-cols-3 gap-4">
                        <label className="relative flex items-center justify-center py-4 px-5 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                            <input type="radio" name="gender" value="Male" checked={inputs.gender === 'Male'} onChange={this.onChange_input} required className="sr-only" />
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.gender === 'Male' ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.gender === 'Male' ? 'scale-100' : 'scale-0'}`}></div>
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${inputs.gender === 'Male' ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>Male</span>
                            </div>
                        </label>
                        <label className="relative flex items-center justify-center py-4 px-5 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                            <input type="radio" name="gender" value="Female" checked={inputs.gender === 'Female'} onChange={this.onChange_input} required className="sr-only" />
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.gender === 'Female' ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.gender === 'Female' ? 'scale-100' : 'scale-0'}`}></div>
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${inputs.gender === 'Female' ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>Female</span>
                            </div>
                        </label>
                        <label className="relative flex items-center justify-center py-4 px-5 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                            <input type="radio" name="gender" value="Other" checked={inputs.gender === 'Other'} onChange={this.onChange_input} required className="sr-only" />
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.gender === 'Other' ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.gender === 'Other' ? 'scale-100' : 'scale-0'}`}></div>
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${inputs.gender === 'Other' ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>Other</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button type="submit" className="px-8 py-4 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group text-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center space-x-3">
                            <span>Continue</span>
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </button>
                </div>
            </form>
        );
    }

    render_second() {
        const { inputs } = this.state;
        return (
            <form className="space-y-8" onSubmit={(e) => this.onNext(e, 'third')}>
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">Contact & Professional Details</h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-600 font-medium">Provide contact and professional information</p>
                </div>

                <div className="space-y-3">
                    <label htmlFor="clientProfile" className="block text-sm font-bold text-gray-700 tracking-wide">Client Profile</label>
                    <div className="relative">
                        <select 
                            id="clientProfile" 
                            name="clientProfile" 
                            value={inputs.clientProfile}
                            onChange={this.onChange_input} 
                            required 
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg appearance-none font-medium text-gray-700"
                        >
                            <option value="">Select user profile</option>
                            <option value="Fishfolk">Fishfolk</option>
                            <option value="Rural Based Org">Rural Based Organization</option>
                            <option value="Student">Student</option>
                            <option value="Agricultural/Fisheries Technician">Agricultural/Fisheries Technician</option>
                            <option value="Youth">Youth</option>
                            <option value="Women">Women</option>
                            <option value="Gov't Employee">Government Employee</option>
                            <option value="PWD">Person with Disability</option>
                            <option value="Indigenous People">Indigenous People</option>
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
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 tracking-wide">Email Address</label>
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
                            value={inputs.email}
                            onChange={(e) => { 
                                this.onChange_input(e); 
                                clearTimeout(this.emailCheckTimeout); 
                                this.emailCheckTimeout = setTimeout(() => { 
                                    this.check_email(e); 
                                }, 500); 
                            }} 
                            required 
                            autoComplete="off"
                            className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium placeholder-gray-400 text-gray-700"
                            placeholder="user@example.com"
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
                    <label htmlFor="address" className="block text-sm font-bold text-gray-700 tracking-wide">Complete Address</label>
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
                            value={inputs.address}
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="off"
                            className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium placeholder-gray-400 text-gray-700"
                            placeholder="Street, Barangay, City, Province"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label htmlFor="telephone" className="block text-sm font-bold text-gray-700 tracking-wide">Telephone Number</label>
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
                                value={inputs.telephoneNumber}
                                onChange={this.onChange_input} 
                                required 
                                autoComplete="off"
                                className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium placeholder-gray-400 text-gray-700"
                                placeholder="(02) 123-4567"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="cellphone" className="block text-sm font-bold text-gray-700 tracking-wide">Mobile Number</label>
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
                                value={inputs.cellphoneNumber}
                                onChange={this.onChange_input} 
                                required 
                                autoComplete="off"
                                className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium placeholder-gray-400 text-gray-700"
                                placeholder="+63 912 345 6789"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label htmlFor="occupation" className="block text-sm font-bold text-gray-700 tracking-wide">Occupation</label>
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
                                value={inputs.occupation}
                                onChange={this.onChange_input} 
                                required 
                                autoComplete="off"
                                className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium placeholder-gray-400 text-gray-700"
                                placeholder="e.g., Farmer, Teacher, Engineer"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="position" className="block text-sm font-bold text-gray-700 tracking-wide">Position/Title</label>
                        <input 
                            type="text" 
                            id="position" 
                            name="position" 
                            value={inputs.position}
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="off"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium placeholder-gray-400 text-gray-700"
                            placeholder="e.g., Senior Officer, Manager"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label htmlFor="institution" className="block text-sm font-bold text-gray-700 tracking-wide">Institution/Organization</label>
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
                            value={inputs.institution}
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="off"
                            className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium placeholder-gray-400 text-gray-700"
                            placeholder="Company, school, or organization name"
                        />
                    </div>
                </div>

                <div className="flex justify-between pt-6">
                    <button 
                        type="button" 
                        onClick={this.onBack}
                        className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold shadow-lg transition-all duration-300 transform hover:scale-[1.02] text-lg border-2 border-gray-200 hover:border-gray-300"
                    >
                        Back
                    </button>
                    <button type="submit" className="px-8 py-4 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group text-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center space-x-3">
                            <span>Continue</span>
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </button>
                </div>
            </form>
        );
    }

    render_third() {
        const { inputs, isLoading } = this.state;
        return (
            <form className="space-y-8" onSubmit={this.post_account}>
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">Account Credentials</h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-600 font-medium">Set up login credentials for the user</p>
                </div>

                <div className="space-y-3">
                    <label htmlFor="username" className="block text-sm font-bold text-gray-700 tracking-wide">Username</label>
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
                            value={inputs.username}
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="off"
                            className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium placeholder-gray-400 text-gray-700"
                            placeholder="Choose a unique username"
                        />
                    </div>
                    <p className="text-sm text-gray-500 font-medium flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Username must be at least 3 characters long and contain only letters and numbers</span>
                    </p>
                </div>

                <div className="space-y-3">
                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 tracking-wide">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={inputs.password}
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="new-password"
                            className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium placeholder-gray-400 text-gray-700"
                            placeholder="Create a secure password"
                        />
                    </div>
                    <p className="text-sm text-gray-500 font-medium flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Password must be at least 6 characters long</span>
                    </p>
                </div>

                <div className="space-y-3">
                    <label htmlFor="confirmPass" className="block text-sm font-bold text-gray-700 tracking-wide">Confirm Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <input 
                            type="password" 
                            id="confirmPass" 
                            name="confirmPass" 
                            value={inputs.confirmPass} 
                            onChange={this.onChange_input} 
                            required 
                            autoComplete="new-password"
                            className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium placeholder-gray-400 text-gray-700"
                            placeholder="Confirm the password"
                        />
                    </div>
                </div>

                <div className="flex justify-between pt-8">
                    <button 
                        type="button" 
                        onClick={this.onBack}
                        disabled={isLoading}
                        className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold shadow-lg transition-all duration-300 transform hover:scale-[1.02] text-lg border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="relative flex items-center space-x-3">
                            {isLoading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Create Account</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </form>
        );
    }
}

export default RegisterUserModal;
