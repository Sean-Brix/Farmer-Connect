import React, { Component } from 'react';

class RegisterUserModal extends Component {
    state = {
        inputs: {
            firstName: '',
            middleName: '',
            surname: '',
            extensionName: '',
            sex: '',
            dateOfBirth: '',
            contactNumber: '',
            client_profile: '',
            email: '',
            username: '',
            password: '',
            confirmPass: '',
            access: 'User',
        },
        isLoading: false,
        showConfirmDialog: false,
    };

    onChange_input = (event) => {
        const { name, value } = event.target;
        this.setState({
            inputs: {
                ...this.state.inputs,
                [name]: value
            }
        });
    };

    validateForm = () => {
        const { inputs } = this.state;
        
        // Debug: Log all input values
        console.log('Validating form with inputs:', inputs);
        
        // Required fields - check each one individually for better debugging
        const requiredFields = {
            firstName: inputs.firstName,
            surname: inputs.surname,
            sex: inputs.sex,
            dateOfBirth: inputs.dateOfBirth,
            contactNumber: inputs.contactNumber,
            client_profile: inputs.client_profile,
            email: inputs.email,
            username: inputs.username,
            password: inputs.password,
            confirmPass: inputs.confirmPass
        };
        
        // Find empty required fields
        const emptyFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value || value.trim() === '')
            .map(([key]) => key);
        
        if (emptyFields.length > 0) {
            console.log('Empty fields:', emptyFields);
            alert(`Please fill in all required fields. Missing: ${emptyFields.join(', ')}`);
            return false;
        }

        // Password length validation
        if (inputs.password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return false;
        }

        // Password match validation
        if (inputs.password !== inputs.confirmPass) {
            alert('Passwords do not match.');
            return false;
        }

        // Contact number validation (Philippine format)
        const contactRegex = /^09\d{9}$/;
        if (!contactRegex.test(inputs.contactNumber)) {
            alert('Contact number must be in format: 09XXXXXXXXX');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputs.email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        // Username validation (at least 3 characters)
        if (inputs.username.length < 3) {
            alert('Username must be at least 3 characters long.');
            return false;
        }

        // Date of birth validation (must be at least 15 years old)
        const birthDate = new Date(inputs.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
        
        if (actualAge < 15) {
            alert('User must be at least 15 years old to register.');
            return false;
        }

        return true;
    };

    post_account = async (event) => {
        event.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        this.setState({ isLoading: true });
        
        const { inputs } = this.state;
        
        // Prepare data for backend - backend expects confirmPass and clientProfile (not client_profile)
        const accountData = {
            firstName: inputs.firstName,
            middleName: inputs.middleName,
            surname: inputs.surname,
            extensionName: inputs.extensionName,
            sex: inputs.sex,
            dateOfBirth: inputs.dateOfBirth,
            contactNumber: inputs.contactNumber,
            clientProfile: inputs.client_profile, // Backend expects clientProfile
            email: inputs.email,
            username: inputs.username,
            password: inputs.password,
            confirmPass: inputs.confirmPass, // Backend needs this for validation
            access: inputs.access
        };
        
        console.log('Sending data to backend:', accountData);
        
        const response = await fetch('/api/account/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accountData),
        });
        
        this.setState({ isLoading: false });
        
        if (!response.ok) {
            const data = await response.json();
            console.log('Backend error response:', data);
            if (response.status === 400) {
                alert(data.message || 'Please check all required fields.');
                return;
            }
            if (response.status === 409) {
                alert(data.message || 'Username or email already exists.');
                return;
            }
            if (response.status === 401) {
                alert('Unauthorized. Admin access required.');
                return;
            }
            if (response.status === 500) {
                alert('Something went wrong. Please try again later.');
                return;
            }
            return;
        }
        
        alert('Account registered successfully!');
        this.resetForm();
        this.props.onSuccess();
        this.props.onClose();
    };

    resetForm = () => {
        this.setState({
            inputs: {
                firstName: '',
                middleName: '',
                surname: '',
                extensionName: '',
                sex: '',
                dateOfBirth: '',
                contactNumber: '',
                client_profile: '',
                email: '',
                username: '',
                password: '',
                confirmPass: '',
                access: 'User',
            },
            isLoading: false,
        });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.open !== this.props.open && this.props.open) {
            this.resetForm();
        }
    }

    hasFormData = () => {
        const { inputs } = this.state;
        const fieldsToCheck = ['firstName', 'middleName', 'surname', 'extensionName', 'sex', 'dateOfBirth', 'contactNumber', 'client_profile', 'email', 'username', 'password', 'confirmPass'];
        return fieldsToCheck.some(field => inputs[field] && inputs[field].trim() !== '');
    };

    handleCloseWithConfirmation = () => {
        if (this.hasFormData()) {
            this.setState({ showConfirmDialog: true });
        } else {
            this.resetForm();
            this.props.onClose();
        }
    };

    handleConfirmCancel = () => {
        this.setState({ showConfirmDialog: false });
        this.resetForm();
        this.props.onClose();
    };

    handleConfirmStay = () => {
        this.setState({ showConfirmDialog: false });
    };

    render() {
        const { open, isDark } = this.props;
        const { inputs, isLoading } = this.state;
        
        if (!open) return null;

        return (
            <React.Fragment>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity p-4">
                    <div className={`backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full relative max-h-[95vh] flex flex-col border ${
                        isDark 
                            ? 'bg-gray-800/95 border-gray-600/20' 
                            : 'bg-white/95 border-white/20'
                    }`}>
                        {/* Close Button */}
                        <div className="absolute top-0 right-0 z-50 p-3 sm:p-6">
                            <button
                                onClick={this.handleCloseWithConfirmation}
                                className={`hover:text-red-500 rounded-full p-2 transition-all duration-300 group focus:outline-none ${
                                    isDark 
                                        ? 'text-gray-400 hover:bg-red-900/20' 
                                        : 'text-gray-400 hover:bg-red-50'
                                }`}
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
                        </div>
                    
                        <div className={`p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto ${
                            isDark ? 'text-gray-200' : ''
                        }`} style={{ maxHeight: '85vh', fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
                            {/* Header */}
                            <div className="text-center mb-6 sm:mb-8">
                                <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-lg opacity-30 scale-110"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-full h-full flex items-center justify-center shadow-xl">
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black bg-clip-text text-transparent px-4 ${
                                        isDark 
                                            ? 'bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100' 
                                            : 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900'
                                    }`}>Register New Account</h2>
                                    <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto shadow-lg"></div>
                                    <p className={`text-sm sm:text-base md:text-lg font-medium px-4 ${
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>Create a new user account</p>
                                </div>
                            </div>

                            {/* Form */}
                            <form className="space-y-6" onSubmit={this.post_account}>
                                {/* Name Section */}
                                <div className="space-y-4">
                                    <div className={`flex items-center gap-3 pb-3 border-b-2 ${
                                        isDark ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <h3 className={`text-lg font-bold ${
                                            isDark ? 'text-gray-200' : 'text-gray-800'
                                        }`}>Basic Information</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className={`block text-sm font-bold tracking-wide ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="firstName" 
                                            name="firstName" 
                                            value={inputs.firstName}
                                            onChange={this.onChange_input} 
                                            required 
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                                isDark 
                                                    ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                                    : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                            }`}
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="middleName" className={`block text-sm font-bold tracking-wide ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>
                                            Middle Name
                                        </label>
                                        <input 
                                            type="text" 
                                            id="middleName" 
                                            name="middleName" 
                                            value={inputs.middleName}
                                            onChange={this.onChange_input} 
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                                isDark 
                                                    ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                                    : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                            }`}
                                            placeholder="Enter middle name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="surname" className={`block text-sm font-bold tracking-wide ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>
                                            Surname <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="surname" 
                                            name="surname" 
                                            value={inputs.surname}
                                            onChange={this.onChange_input} 
                                            required 
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                                isDark 
                                                    ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                                    : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                            }`}
                                            placeholder="Enter surname"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="extensionName" className={`block text-sm font-bold tracking-wide ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>
                                            Extension Name
                                        </label>
                                        <input 
                                            type="text" 
                                            id="extensionName" 
                                            name="extensionName" 
                                            value={inputs.extensionName}
                                            onChange={this.onChange_input} 
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                                isDark 
                                                    ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                                    : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                            }`}
                                            placeholder="Jr., Sr., III"
                                        />
                                    </div>
                                </div>
                                </div>

                                {/* Personal Information Section */}
                                <div className="space-y-4">
                                    <div className={`flex items-center gap-3 pb-3 border-b-2 ${
                                        isDark ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <h3 className={`text-lg font-bold ${
                                            isDark ? 'text-gray-200' : 'text-gray-800'
                                        }`}>Personal Information</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="sex" className={`block text-sm font-bold tracking-wide ${
                                                isDark ? 'text-gray-200' : 'text-gray-700'
                                            }`}>
                                                Sex <span className="text-red-500">*</span>
                                            </label>
                                            <select 
                                                id="sex" 
                                                name="sex" 
                                                value={inputs.sex}
                                                onChange={this.onChange_input} 
                                                required 
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg appearance-none font-medium ${
                                                    isDark 
                                                        ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 text-gray-100' 
                                                        : 'bg-white/80 border-gray-200 hover:border-gray-300 text-gray-700'
                                                }`}
                                            >
                                                <option value="">Select sex</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="dateOfBirth" className={`block text-sm font-bold tracking-wide ${
                                                isDark ? 'text-gray-200' : 'text-gray-700'
                                            }`}>
                                                Date of Birth <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="date" 
                                                id="dateOfBirth" 
                                                name="dateOfBirth" 
                                                value={inputs.dateOfBirth}
                                                onChange={this.onChange_input} 
                                                required 
                                                max={new Date().toISOString().split('T')[0]}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                                    isDark 
                                                        ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100' 
                                                        : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700'
                                                }`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="contactNumber" className={`block text-sm font-bold tracking-wide ${
                                                isDark ? 'text-gray-200' : 'text-gray-700'
                                            }`}>
                                                Contact Number <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="tel" 
                                                id="contactNumber" 
                                                name="contactNumber" 
                                                value={inputs.contactNumber}
                                                onChange={this.onChange_input} 
                                                required 
                                                pattern="09[0-9]{9}"
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                                    isDark 
                                                        ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                                        : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                            }`}
                                                placeholder="09XXXXXXXXX"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Classification Section */}
                                <div className="space-y-4">
                                    <div className={`flex items-center gap-3 pb-3 border-b-2 ${
                                        isDark ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className={`text-lg font-bold ${
                                            isDark ? 'text-gray-200' : 'text-gray-800'
                                        }`}>Profile Classification</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="client_profile" className={`block text-sm font-bold tracking-wide ${
                                                isDark ? 'text-gray-200' : 'text-gray-700'
                                            }`}>
                                                Client Profile <span className="text-red-500">*</span>
                                            </label>
                                            <select 
                                                id="client_profile" 
                                                name="client_profile" 
                                                value={inputs.client_profile}
                                                onChange={this.onChange_input} 
                                                required 
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg appearance-none font-medium ${
                                                    isDark 
                                                        ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 text-gray-100' 
                                                        : 'bg-white/80 border-gray-200 hover:border-gray-300 text-gray-700'
                                                }`}
                                            >
                                                <option value="">Select profile</option>
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
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="access" className={`block text-sm font-bold tracking-wide ${
                                                isDark ? 'text-gray-200' : 'text-gray-700'
                                            }`}>
                                                Access Role <span className="text-red-500">*</span>
                                            </label>
                                            <select 
                                                id="access" 
                                                name="access" 
                                                value={inputs.access}
                                                onChange={this.onChange_input} 
                                                required 
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg appearance-none font-medium ${
                                                    isDark 
                                                        ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 text-gray-100' 
                                                        : 'bg-white/80 border-gray-200 hover:border-gray-300 text-gray-700'
                                                }`}
                                            >
                                                <option value="User">User</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Super Admin">Super Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information Section */}
                                <div className="space-y-4">
                                    <div className={`flex items-center gap-3 pb-3 border-b-2 ${
                                        isDark ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <h3 className={`text-lg font-bold ${
                                            isDark ? 'text-gray-200' : 'text-gray-800'
                                        }`}>Contact Information</h3>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label htmlFor="email" className={`block text-sm font-bold tracking-wide ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            value={inputs.email}
                                            onChange={this.onChange_input} 
                                            required 
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                                isDark 
                                                    ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                                    : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                            }`}
                                            placeholder="user@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Account Credentials Section */}
                                <div className="space-y-4">
                                    <div className={`flex items-center gap-3 pb-3 border-b-2 ${
                                        isDark ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                        <h3 className={`text-lg font-bold ${
                                            isDark ? 'text-gray-200' : 'text-gray-800'
                                        }`}>Account Credentials</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="username" className={`block text-sm font-bold tracking-wide ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>
                                            Username <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="username" 
                                            name="username" 
                                            value={inputs.username}
                                            onChange={this.onChange_input} 
                                            required 
                                            minLength="3"
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                                isDark 
                                                    ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                                    : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                            }`}
                                            placeholder="Choose username"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="password" className={`block text-sm font-bold tracking-wide ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="password" 
                                            id="password" 
                                            name="password" 
                                            value={inputs.password}
                                            onChange={this.onChange_input} 
                                            required 
                                            minLength="6"
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                                isDark 
                                                    ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                                    : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                            }`}
                                            placeholder="Min 6 characters"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="confirmPass" className={`block text-sm font-bold tracking-wide ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="password" 
                                            id="confirmPass" 
                                            name="confirmPass" 
                                            value={inputs.confirmPass} 
                                            onChange={this.onChange_input} 
                                            required 
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                                isDark 
                                                    ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                                    : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                            }`}
                                            placeholder="Repeat password"
                                        />
                                    </div>
                                </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-6">
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="px-8 py-4 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                        </div>
                    </div>
                </div>

                {/* Confirmation Dialog */}
                {this.state.showConfirmDialog && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
                        <div className={`relative mx-4 w-full max-w-md rounded-2xl shadow-2xl border ${
                            isDark 
                                ? 'bg-gray-800 border-gray-600' 
                                : 'bg-white border-gray-200'
                        }`}>
                            <div className="flex flex-col items-center px-6 pt-8 pb-4">
                                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className={`text-xl font-bold text-center mb-2 ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                    Cancel Registration?
                                </h3>
                                <p className={`text-center leading-relaxed ${
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    Are you sure you want to cancel? All entered information will be lost.
                                </p>
                            </div>

                            <div className="flex gap-3 px-6 pb-6">
                                <button
                                    onClick={this.handleConfirmStay}
                                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        isDark 
                                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400'
                                    }`}
                                >
                                    Continue Editing
                                </button>
                                <button
                                    onClick={this.handleConfirmCancel}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                                >
                                    Yes, Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default RegisterUserModal;
