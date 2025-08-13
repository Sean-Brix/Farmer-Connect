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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity">
                <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 relative max-h-[95vh] flex flex-col border border-green-100">
                    <button
                        onClick={() => {
                            this.resetForm();
                            onClose();
                        }}
                        className="absolute top-5 right-5 text-gray-400 hover:text-green-600 text-2xl font-bold focus:outline-none transition-colors z-10"
                        aria-label="Close"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
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
                    
                    <div className="p-8 overflow-y-auto" style={{ maxHeight: '85vh', fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Register New User</h2>
                            <p className="text-gray-500">Create a new account for the system</p>
                        </div>

                        {/* Stepper */}
                        <div className="relative flex items-center mb-8 w-full max-w-lg mx-auto">
                            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-green-100 via-green-200 to-green-100 rounded-full shadow-inner z-0" style={{ transform: 'translateY(-50%)' }} />
                            <div className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg z-10 transition-all duration-500" style={{ width: `${(stepIndex) / (this.steps.length - 1) * 100}%`, transform: 'translateY(-50%)' }} />
                            
                            {this.steps.map((step, idx) => (
                                <div key={step.label} className="relative flex-1 flex flex-col items-center z-20">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 transition-all duration-300 shadow-md ${idx < stepIndex ? 'border-green-600 bg-green-600 text-white' : idx === stepIndex ? 'border-green-600 bg-white text-green-700 font-bold' : 'border-gray-300 bg-white text-gray-400'}`}>
                                        {idx + 1}
                                    </div>
                                    <span className={`mt-2 text-xs text-center ${idx < stepIndex ? 'text-green-600' : idx === stepIndex ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Form Content */}
                        <div className="w-full max-w-2xl mx-auto">
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
            <form className="space-y-6" onSubmit={(e) => this.onNext(e, 'second')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fname" className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                        <input 
                            type="text" 
                            id="fname" 
                            name="firstName" 
                            value={inputs.firstName}
                            onChange={this.onChange_input} 
                            required 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="lname" className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                        <input 
                            type="text" 
                            id="lname" 
                            name="lastName" 
                            value={inputs.lastName}
                            onChange={this.onChange_input} 
                            required 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
                    <div className="flex space-x-6">
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="gender" value="Male" checked={inputs.gender === 'Male'} onChange={this.onChange_input} required className="accent-green-600 w-4 h-4" />
                            <span className="ml-2 text-gray-700">Male</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="gender" value="Female" checked={inputs.gender === 'Female'} onChange={this.onChange_input} required className="accent-green-600 w-4 h-4" />
                            <span className="ml-2 text-gray-700">Female</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="gender" value="Other" checked={inputs.gender === 'Other'} onChange={this.onChange_input} required className="accent-green-600 w-4 h-4" />
                            <span className="ml-2 text-gray-700">Other</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition">
                        Next
                    </button>
                </div>
            </form>
        );
    }

    render_second() {
        const { inputs } = this.state;
        return (
            <form className="space-y-6" onSubmit={(e) => this.onNext(e, 'third')}>
                <div>
                    <label htmlFor="clientProfile" className="block text-sm font-semibold text-gray-700 mb-2">Client Profile</label>
                    <select 
                        id="clientProfile" 
                        name="clientProfile" 
                        value={inputs.clientProfile}
                        onChange={this.onChange_input} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                    >
                        <option value="">Select profile</option>
                        <option value="Fishfolk">Fishfolk</option>
                        <option value="Rural Based Org">Rural Based Org</option>
                        <option value="Student">Student</option>
                        <option value="Agricultural/Fisheries Technician">Agricultural/Fisheries Technician</option>
                        <option value="Youth">Youth</option>
                        <option value="Women">Women</option>
                        <option value="Gov't Employee">Gov't Employee</option>
                        <option value="PWD">PWD</option>
                        <option value="Indigenous People">Indigenous People</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                    />
                    {this.state.email_prompt && (
                        <p className={`mt-2 text-sm ${this.state.checkEmail ? 'text-green-600' : 'text-red-600'}`}>
                            {this.state.email_prompt}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <input 
                        type="text" 
                        id="address" 
                        name="address" 
                        value={inputs.address}
                        onChange={this.onChange_input} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="telephone" className="block text-sm font-semibold text-gray-700 mb-2">Telephone No</label>
                        <input 
                            type="tel" 
                            id="telephone" 
                            name="telephoneNumber" 
                            value={inputs.telephoneNumber}
                            onChange={this.onChange_input} 
                            required 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="cellphone" className="block text-sm font-semibold text-gray-700 mb-2">Cellphone No</label>
                        <input 
                            type="tel" 
                            id="cellphone" 
                            name="cellphoneNumber" 
                            value={inputs.cellphoneNumber}
                            onChange={this.onChange_input} 
                            required 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="occupation" className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                        <input 
                            type="text" 
                            id="occupation" 
                            name="occupation" 
                            value={inputs.occupation}
                            onChange={this.onChange_input} 
                            required 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                        <input 
                            type="text" 
                            id="position" 
                            name="position" 
                            value={inputs.position}
                            onChange={this.onChange_input} 
                            required 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="institution" className="block text-sm font-semibold text-gray-700 mb-2">Institution</label>
                    <input 
                        type="text" 
                        id="institution" 
                        name="institution" 
                        value={inputs.institution}
                        onChange={this.onChange_input} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                    />
                </div>

                <div className="flex justify-between gap-3 pt-4">
                    <button 
                        type="button" 
                        onClick={this.onBack}
                        className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold shadow hover:bg-gray-400 transition"
                    >
                        Back
                    </button>
                    <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition">
                        Next
                    </button>
                </div>
            </form>
        );
    }

    render_third() {
        const { inputs, isLoading } = this.state;
        return (
            <form className="space-y-6" onSubmit={this.post_account}>
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={inputs.username}
                        onChange={this.onChange_input} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={inputs.password}
                        onChange={this.onChange_input} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                    />
                </div>

                <div>
                    <label htmlFor="confirmPass" className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <input 
                        type="password" 
                        id="confirmPass" 
                        name="confirmPass" 
                        value={inputs.confirmPass} 
                        onChange={this.onChange_input} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition"
                    />
                </div>

                <div className="flex justify-between gap-3 pt-4">
                    <button 
                        type="button" 
                        onClick={this.onBack}
                        className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold shadow hover:bg-gray-400 transition"
                    >
                        Back
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>
            </form>
        );
    }
}

export default RegisterUserModal;
