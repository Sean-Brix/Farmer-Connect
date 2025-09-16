import React, { Component } from 'react';

class RegisterUserModal extends Component {
    // Fields - using state instead of class property to persist data
    state = {
        inputs: {
            // Personal Information
            firstName: '',
            middleName: '',
            surname: '',
            extensionName: '',
            sex: '',
            street: '',
            barangay: '',
            municipality: 'Tanza',
            province: 'Cavite',
            region: 'CALABARZON',
            houseNumber: '',
            mobileNumber: '',
            landlineNumber: '',
            birthMunicipality: '',
            birthProvince: '',
            birthCountry: 'Philippines',
            dateOfBirth: '',
            religion: '',
            otherReligionSpecify: '',
            civilStatus: '',
            spouseName: '',
            femaleHouseholdMembers: '',
            maleHouseholdMembers: '',
            isHouseholdHead: '',
            householdHeadName: '',
            relationshipToHead: '',
            hasGovId: '',
            govIdType: '',
            govIdNumber: '',
            
            // Education
            education: '',
            
            // PWD Information
            isPWD: '',
            disabilityType: '',
            
            // Livelihood Profile
            livelihoodProfile: [],
            farmingActivities: [],
            fishingActivities: [],
            farmworkActivities: [],
            youthActivities: [],
            otherCropsSpecify: '',
            livestockSpecify: '',
            fishingOthersSpecify: '',
            farmworkOthersSpecify: '',
            youthOthersSpecify: '',
            
            // Income
            grossAnnualIncome: '',
            incomeSource: '', // farming or non-farming
            
            // Account Details
            email: '',
            username: '',
            password: '',
            confirmPass: '',
            profilePhoto: null,
        },
        register: 'first',
        confirm_value: '',
        checkEmail: false,
        email_prompt: '',
        isLoading: false,
        currentStep: 1,
        totalSteps: 5,
        showConfirmDialog: false
    };

    steps = [
        { label: 'Personal Info', icon: '👤' },
        { label: 'Education & PWD', icon: '🎓' },
        { label: 'Livelihood', icon: '🌾' },
        { label: 'Account', icon: '🔐' },
    ];

    // Generate reference number
    generateReferenceNumber = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `RSBSA-${timestamp}-${random}`;
    };

    // Validate date of birth
    validateDateOfBirth = (dateString) => {
        if (!dateString) return { isValid: false, message: 'Date of birth is required' };
        
        const birthDate = new Date(dateString);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Adjust age if birthday hasn't occurred this year
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
        
        if (birthDate > today) {
            return { isValid: false, message: 'Birth date cannot be in the future' };
        }
        
        if (actualAge < 15) {
            return { isValid: false, message: 'Must be at least 15 years old to register' };
        }
        
        if (actualAge > 120) {
            return { isValid: false, message: 'Please enter a valid birth date' };
        }
        
        return { isValid: true, message: '', age: actualAge };
    };

    // Handle file upload
    handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPEG, JPG, or PNG)');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            
            this.setState({
                inputs: {
                    ...this.state.inputs,
                    profilePhoto: file
                }
            });
        }
    };

    // Handle checkbox changes
    handleCheckboxChange = (name, value, isChecked) => {
        this.setState(prevState => {
            const currentArray = prevState.inputs[name] || [];
            let newArray;
            
            if (isChecked) {
                newArray = [...currentArray, value];
            } else {
                newArray = currentArray.filter(item => item !== value);
            }
            
            return {
                inputs: {
                    ...prevState.inputs,
                    [name]: newArray
                }
            };
        });
    };

    // Validate current step
    validateCurrentStep = () => {
        const { inputs, currentStep } = this.state;
        
        switch (currentStep) {
            case 1: // Personal Information
                // Basic required fields
                const basicFieldsValid = inputs.firstName && inputs.surname && inputs.sex && 
                       inputs.street && inputs.barangay && inputs.municipality && 
                       inputs.province && inputs.region && inputs.mobileNumber && 
                       inputs.birthMunicipality && inputs.birthProvince && inputs.birthCountry &&
                       inputs.dateOfBirth && inputs.religion && inputs.civilStatus;
                
                // Religion - if Others is selected, otherReligionSpecify is required
                const religionValid = inputs.religion !== 'Others' || 
                       (inputs.religion === 'Others' && inputs.otherReligionSpecify);
                
                // Household head validation
                const householdValid = inputs.isHouseholdHead && 
                       (inputs.isHouseholdHead === 'Yes' || 
                        (inputs.isHouseholdHead === 'No' && inputs.householdHeadName && inputs.relationshipToHead));
                
                // Government ID validation
                const govIdValid = inputs.hasGovId && 
                       (inputs.hasGovId === 'No' || 
                        (inputs.hasGovId === 'Yes' && inputs.govIdType && inputs.govIdNumber));
                
                // Date of birth validation
                const dateValid = this.validateDateOfBirth(inputs.dateOfBirth).isValid;
                
                return basicFieldsValid && religionValid && householdValid && govIdValid && dateValid;
                
            case 2: // Education & PWD
                const pwdValid = inputs.isPWD && 
                       (inputs.isPWD === 'No' || 
                        (inputs.isPWD === 'Yes' && inputs.disabilityType));
                
                return inputs.education && pwdValid;
                
            case 3: // Livelihood
                const livelihoodValid = inputs.livelihoodProfile.length > 0;
                const incomeValid = inputs.grossAnnualIncome && inputs.incomeSource;
                
                return livelihoodValid && incomeValid;
                
            case 4: // Account Setup
                const passwordMatch = inputs.password === inputs.confirmPass;
                const profilePhotoValid = inputs.profilePhoto !== null;
                
                return inputs.email && inputs.username && inputs.password && 
                       inputs.confirmPass && passwordMatch && profilePhotoValid;
                       
            default:
                return true;
        }
    };

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

    onNext = () => {
        if (this.validateCurrentStep()) {
            if (this.state.currentStep < this.state.totalSteps) {
                this.setState({ currentStep: this.state.currentStep + 1 });
            }
        } else {
            alert('Please fill in all required fields before continuing.');
        }
    };

    onBack = () => {
        if (this.state.currentStep > 1) {
            this.setState({ currentStep: this.state.currentStep - 1 });
        }
    };

    post_account = async (event) => {
        event.preventDefault();
        
        if (!this.validateCurrentStep()) {
            alert('Please fill in all required fields.');
            return;
        }
        
        this.setState({ isLoading: true });
        
        // Generate reference number if not provided
        if (!this.state.inputs.referenceNumber) {
            this.setState({
                inputs: {
                    ...this.state.inputs,
                    referenceNumber: this.generateReferenceNumber()
                }
            });
        }
        
        const { inputs } = this.state;
        
        // Create FormData for file upload
        const formData = new FormData();
        
        // Add all form fields
        Object.keys(inputs).forEach(key => {
            if (Array.isArray(inputs[key])) {
                formData.append(key, JSON.stringify(inputs[key]));
            } else if (inputs[key] !== null && inputs[key] !== '') {
                formData.append(key, inputs[key]);
            }
        });
        
        const response = await fetch('/api/account/register-rsbsa', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });
        
        this.setState({ isLoading: false });
        const data = await response.json();
        
        if (!response.ok) {
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
        
        alert('RSBSA Account registered successfully!');
        this.props.onSuccess();
        this.props.onClose();
    };

    resetForm = () => {
        this.setState({
            inputs: {
                // Personal Information
                firstName: '',
                middleName: '',
                surname: '',
                extensionName: '',
                sex: '',
                street: '',
                barangay: '',
                municipality: '',
                province: '',
                region: '',
                houseNumber: '',
                mobileNumber: '',
                landlineNumber: '',
                birthMunicipality: '',
                birthProvince: '',
                birthCountry: 'Philippines',
                dateOfBirth: '',
                religion: '',
                otherReligionSpecify: '',
                civilStatus: '',
                spouseName: '',
                femaleHouseholdMembers: '',
                maleHouseholdMembers: '',
                isHouseholdHead: '',
                householdHeadName: '',
                relationshipToHead: '',
                hasGovId: '',
                govIdType: '',
                govIdNumber: '',
                
                // Education
                education: '',
                
                // PWD Information
                isPWD: '',
                disabilityType: '',
                
                // Livelihood Profile
                livelihoodProfile: [],
                farmingActivities: [],
                fishingActivities: [],
                farmworkActivities: [],
                youthActivities: [],
                otherCropsSpecify: '',
                livestockSpecify: '',
                fishingOthersSpecify: '',
                farmworkOthersSpecify: '',
                youthOthersSpecify: '',
                
                // Income and Photo
                grossAnnualIncome: '',
                incomeSource: '',
                profilePhoto: null,
                referenceNumber: '',
                
                // Account Details
                email: '',
                username: '',
                password: '',
                confirmPass: '',
            },
            register: 'first',
            confirm_value: '',
            checkEmail: false,
            email_prompt: '',
            isLoading: false,
            currentStep: 1
        });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.open !== this.props.open && this.props.open) {
            this.resetForm();
        }
    }

    // Method to check if form has any data
    hasFormData = () => {
        const { inputs } = this.state;
        const fieldsToCheck = [
            'firstName', 'middleName', 'surname', 'extensionName', 'sex', 'street', 'barangay',
            'houseNumber', 'mobileNumber', 'landlineNumber', 'birthMunicipality', 'birthProvince',
            'dateOfBirth', 'religion', 'otherReligionSpecify', 'civilStatus', 'spouseName',
            'femaleHouseholdMembers', 'maleHouseholdMembers', 'householdHeadName', 'relationshipToHead',
            'govIdNumber', 'disabilityType', 'username', 'email', 'password', 'confirmPassword'
        ];
        
        return fieldsToCheck.some(field => inputs[field] && inputs[field].trim() !== '') ||
               inputs.livelihoodProfile.length > 0 ||
               inputs.farmingActivities.length > 0 ||
               inputs.fishingActivities.length > 0 ||
               inputs.farmworkActivities.length > 0 ||
               inputs.youthActivities.length > 0;
    };

    // Method to handle close with confirmation
    handleCloseWithConfirmation = () => {
        if (this.hasFormData()) {
            this.setState({ showConfirmDialog: true });
        } else {
            this.resetForm();
            this.props.onClose();
        }
    };

    // Method to handle confirmation dialog actions
    handleConfirmCancel = () => {
        this.setState({ showConfirmDialog: false });
        this.resetForm();
        this.props.onClose();
    };

    handleConfirmStay = () => {
        this.setState({ showConfirmDialog: false });
    };

    render() {
        const { open, onClose, isDark } = this.props;
        const { currentStep, isLoading } = this.state;
        
        if (!open) return null;

        return (
            <React.Fragment>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity">
                    <div className={`backdrop-blur-sm rounded-3xl shadow-2xl max-w-6xl w-full mx-6 relative max-h-[95vh] flex flex-col border ${
                        isDark 
                            ? 'bg-gray-800/95 border-gray-600/20' 
                            : 'bg-white/95 border-white/20'
                    }`} style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'}}>
                        <button
                            onClick={this.handleCloseWithConfirmation}
                            className={`absolute top-6 right-6 hover:text-red-500 rounded-full p-2 transition-all duration-300 group focus:outline-none z-10 ${
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
                    
                    <div className={`p-10 overflow-y-auto ${
                        isDark ? 'text-gray-200' : ''
                    }`} style={{ maxHeight: '85vh', fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-lg opacity-30 scale-110"></div>
                                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-full h-full flex items-center justify-center shadow-xl">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h2 className={`text-4xl font-black bg-clip-text text-transparent ${
                                    isDark 
                                        ? 'bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100' 
                                        : 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900'
                                }`}>RSBSA Registration</h2>
                                <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto shadow-lg"></div>
                                <p className={`text-lg font-medium ${
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>Registry System for Basic Sectors in Agriculture</p>
                            </div>
                        </div>

                        {/* Stepper */}
                        <div className="relative flex items-center mb-10 w-full max-w-4xl mx-auto">
                            <div className={`absolute top-1/2 left-0 right-0 h-3 rounded-full shadow-inner border ${
                                isDark 
                                    ? 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 border-gray-600/50' 
                                    : 'bg-gradient-to-r from-gray-100 via-gray-150 to-gray-100 border-gray-200/50'
                            }`} style={{ transform: 'translateY(-50%)' }} />
                            <div className="absolute top-1/2 left-0 h-3 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full shadow-lg border border-green-400/30 transition-all duration-700 ease-out" style={{ width: `${(currentStep - 1) / (this.steps.length - 1) * 100}%`, transform: 'translateY(-50%)', boxShadow: '0 4px 14px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.3)' }} />
                            
                            {this.steps.map((step, idx) => (
                                <div key={step.label} className="relative flex-1 flex flex-col items-center z-20">
                                    <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-500 shadow-lg font-bold text-2xl ${
                                        idx < currentStep - 1 
                                            ? 'border-green-600 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-200' 
                                            : idx === currentStep - 1 
                                                ? `border-green-600 text-green-700 shadow-green-300 ring-4 ring-green-100 ${
                                                    isDark ? 'bg-gray-700' : 'bg-white'
                                                }` 
                                                : `border-gray-300 text-gray-400 shadow-gray-200 ${
                                                    isDark ? 'bg-gray-700' : 'bg-white'
                                                }`
                                    }`} style={{boxShadow: idx === currentStep - 1 ? '0 8px 25px rgba(34,197,94,0.25), 0 0 0 4px rgba(34,197,94,0.1)' : undefined}}>
                                        {step.icon}
                                    </div>
                                    <span className={`mt-3 text-sm font-semibold text-center transition-colors duration-300 ${
                                        idx < currentStep - 1 
                                            ? 'text-green-600' 
                                            : idx === currentStep - 1 
                                                ? 'text-green-700' 
                                                : isDark ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Form Content */}
                        <div className="w-full max-w-5xl mx-auto">
                            {currentStep === 1 && this.renderPersonalInfo()}
                            {currentStep === 2 && this.renderEducationPWD()}
                            {currentStep === 3 && this.renderLivelihood()}
                            {currentStep === 4 && this.renderAccountSetup()}
                        </div>
                    </div>
                    
                    {/* Custom Confirmation Dialog */}
                    {this.state.showConfirmDialog && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
                            <div className={`relative mx-4 w-full max-w-md rounded-2xl shadow-2xl border ${
                                isDark 
                                    ? 'bg-gray-800 border-gray-600' 
                                    : 'bg-white border-gray-200'
                            }`} style={{
                                animation: 'fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}>
                                {/* Icon and Title */}
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
                                        Are you sure you want to cancel? All entered information will be lost and cannot be recovered.
                                    </p>
                                </div>

                                {/* Action Buttons */}
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
                </div>
            </div>

                {/* Custom Confirmation Dialog - Full Screen Overlay */}
                {this.state.showConfirmDialog && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
                        <div className={`relative mx-4 w-full max-w-md rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border ${
                            isDark 
                                ? 'bg-gray-800 border-gray-600' 
                                : 'bg-white border-gray-200'
                        }`} style={{
                            animation: 'fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}>
                            {/* Icon and Title */}
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
                                    Are you sure you want to cancel? All entered information will be lost and cannot be recovered.
                                </p>
                            </div>

                            {/* Action Buttons */}
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

    renderPersonalInfo() {
        const { inputs } = this.state;
        const { isDark } = this.props;
        return (
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); this.onNext(); }}>
                <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${
                        isDark 
                            ? 'from-gray-100 to-gray-300' 
                            : 'from-gray-900 to-gray-700'
                    } bg-clip-text text-transparent mb-3`}>🧑 Personal Information</h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-3"></div>
                    <p className={`font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Enter basic personal details and contact information</p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-3">
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
                    <div className="space-y-3">
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
                    <div className="space-y-3">
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
                    <div className="space-y-3">
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

                {/* Sex */}
                <div className="space-y-4">
                    <label className={`block text-sm font-bold tracking-wide ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                        Sex <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className={`relative flex items-center justify-center py-4 px-5 border-2 rounded-xl cursor-pointer hover:border-green-400 transition-all duration-300 group backdrop-blur-sm ${
                            isDark 
                                ? 'border-gray-600 hover:bg-green-900/20 bg-gray-700/60' 
                                : 'border-gray-200 hover:bg-green-50/50 bg-white/60'
                        }`}>
                            <input type="radio" name="sex" value="Male" checked={inputs.sex === 'Male'} onChange={this.onChange_input} required className="sr-only" />
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.sex === 'Male' ? 'border-green-500 bg-green-500' : isDark ? 'border-gray-500 group-hover:border-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.sex === 'Male' ? 'scale-100' : 'scale-0'}`}></div>
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${
                                    inputs.sex === 'Male' 
                                        ? 'text-green-700' 
                                        : isDark 
                                            ? 'text-gray-200 group-hover:text-green-400' 
                                            : 'text-gray-700 group-hover:text-green-700'
                                }`}>Male</span>
                            </div>
                        </label>
                        <label className={`relative flex items-center justify-center py-4 px-5 border-2 rounded-xl cursor-pointer hover:border-green-400 transition-all duration-300 group backdrop-blur-sm ${
                            isDark 
                                ? 'border-gray-600 hover:bg-green-900/20 bg-gray-700/60' 
                                : 'border-gray-200 hover:bg-green-50/50 bg-white/60'
                        }`}>
                            <input type="radio" name="sex" value="Female" checked={inputs.sex === 'Female'} onChange={this.onChange_input} required className="sr-only" />
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.sex === 'Female' ? 'border-green-500 bg-green-500' : isDark ? 'border-gray-500 group-hover:border-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.sex === 'Female' ? 'scale-100' : 'scale-0'}`}></div>
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${
                                    inputs.sex === 'Female' 
                                        ? 'text-green-700' 
                                        : isDark 
                                            ? 'text-gray-200 group-hover:text-green-400' 
                                            : 'text-gray-700 group-hover:text-green-700'
                                }`}>Female</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Address */}
                <div className="space-y-6">
                    <h4 className={`text-lg font-semibold border-b pb-2 ${
                        isDark 
                            ? 'text-gray-200 border-gray-600' 
                            : 'text-gray-700 border-gray-300'
                    }`}>Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label htmlFor="street" className={`block text-sm font-bold tracking-wide ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Street/Sitio/Purok <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="street" 
                                name="street" 
                                value={inputs.street}
                                onChange={this.onChange_input} 
                                required 
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                    isDark 
                                        ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                        : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                }`}
                                placeholder="Enter street address"
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="barangay" className={`block text-sm font-bold tracking-wide ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Barangay <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="barangay" 
                                name="barangay" 
                                value={inputs.barangay}
                                onChange={this.onChange_input} 
                                required 
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                    isDark 
                                        ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                        : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                }`}
                                placeholder="Enter barangay"
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="municipality" className={`block text-sm font-bold tracking-wide ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Municipality/City <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="municipality" 
                                name="municipality" 
                                value={inputs.municipality}
                                onChange={this.onChange_input} 
                                required 
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                    isDark 
                                        ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                        : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                }`}
                                placeholder="Enter municipality/city"
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="province" className={`block text-sm font-bold tracking-wide ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Province <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="province" 
                                name="province" 
                                value={inputs.province}
                                onChange={this.onChange_input} 
                                required 
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                    isDark 
                                        ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                        : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                                }`}
                                placeholder="Enter province"
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="region" className={`block text-sm font-bold tracking-wide ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Region <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="region" 
                                name="region" 
                                value={inputs.region}
                                onChange={this.onChange_input} 
                                required 
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                        : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                                }`}
                                placeholder="Enter region"
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="houseNumber" className={`block text-sm font-bold tracking-wide ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                House/Lot/Building No./Floor
                            </label>
                            <input 
                                type="text" 
                                id="houseNumber" 
                                name="houseNumber" 
                                value={inputs.houseNumber}
                                onChange={this.onChange_input} 
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                        : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                                }`}
                                placeholder="Enter house number"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label htmlFor="mobileNumber" className={`block text-sm font-bold tracking-wide ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="tel" 
                            id="mobileNumber" 
                            name="mobileNumber" 
                            value={inputs.mobileNumber}
                            onChange={this.onChange_input} 
                            required 
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg font-medium ${
                                isDark 
                                    ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 placeholder-gray-400 text-gray-100' 
                                    : 'bg-white/80 border-gray-200 hover:border-gray-300 placeholder-gray-400 text-gray-700'
                            }`}
                            placeholder="+63 912 345 6789"
                        />
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="landlineNumber" className={`block text-sm font-bold tracking-wide ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            Landline Number
                        </label>
                        <input 
                            type="tel" 
                            id="landlineNumber" 
                            name="landlineNumber" 
                            value={inputs.landlineNumber}
                            onChange={this.onChange_input} 
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                isDark 
                                    ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                    : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                            }`}
                            placeholder="(02) 123-4567"
                        />
                    </div>
                </div>

                {/* Birth Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label htmlFor="placeOfBirth" className={`block text-sm font-bold tracking-wide ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            Place of Birth - Municipality/City <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="birthMunicipality" 
                            name="birthMunicipality" 
                            value={inputs.birthMunicipality}
                            onChange={this.onChange_input} 
                            required 
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                isDark 
                                    ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                    : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                            }`}
                            placeholder="Enter municipality/city of birth"
                        />
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="birthProvince" className={`block text-sm font-bold tracking-wide ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            Place of Birth - Province/State <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="birthProvince" 
                            name="birthProvince" 
                            value={inputs.birthProvince}
                            onChange={this.onChange_input} 
                            required 
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                isDark 
                                    ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                    : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                            }`}
                            placeholder="Enter province/state of birth"
                        />
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="birthCountry" className={`block text-sm font-bold tracking-wide ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            Place of Birth - Country <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="birthCountry" 
                            name="birthCountry" 
                            value={inputs.birthCountry}
                            onChange={this.onChange_input} 
                            required 
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                isDark 
                                    ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                    : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                            }`}
                            placeholder="Enter country of birth"
                        />
                    </div>
                    <div className="space-y-3">
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
                            onChange={(e) => {
                                this.onChange_input(e);
                                const validation = this.validateDateOfBirth(e.target.value);
                                if (!validation.isValid && e.target.value) {
                                    e.target.setCustomValidity(validation.message);
                                } else {
                                    e.target.setCustomValidity('');
                                }
                            }} 
                            required 
                            max={new Date().toISOString().split('T')[0]}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                isDark 
                                    ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100' 
                                    : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700'
                            }`}
                        />
                    </div>
                </div>

                {/* Religion and Civil Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label htmlFor="religion" className={`block text-sm font-bold tracking-wide ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            Religion <span className="text-red-500">*</span>
                        </label>
                        <select 
                            id="religion" 
                            name="religion" 
                            value={inputs.religion}
                            onChange={this.onChange_input} 
                            required 
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg appearance-none font-medium ${
                                isDark 
                                    ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 text-gray-100' 
                                    : 'bg-white/80 border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                        >
                            <option value="">Select religion</option>
                            <option value="Roman Catholic">Roman Catholic</option>
                            <option value="Protestant">Protestant</option>
                            <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                            <option value="Islam">Islam</option>
                            <option value="Buddhism">Buddhism</option>
                            <option value="Baptist">Baptist</option>
                            <option value="Methodist">Methodist</option>
                            <option value="Pentecostal">Pentecostal</option>
                            <option value="Seventh-day Adventist">Seventh-day Adventist</option>
                            <option value="Jehovah's Witnesses">Jehovah's Witnesses</option>
                            <option value="Born Again Christian">Born Again Christian</option>
                            <option value="Others">Others</option>
                        </select>
                        {inputs.religion === 'Others' && (
                            <input 
                                type="text" 
                                name="otherReligionSpecify" 
                                value={inputs.otherReligionSpecify}
                                onChange={this.onChange_input} 
                                required={inputs.religion === 'Others'}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium mt-3 ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                        : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                                }`}
                                placeholder="Please specify your religion"
                            />
                        )}
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="civilStatus" className={`block text-sm font-bold tracking-wide ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            Civil Status <span className="text-red-500">*</span>
                        </label>
                        <select 
                            id="civilStatus" 
                            name="civilStatus" 
                            value={inputs.civilStatus}
                            onChange={this.onChange_input} 
                            required 
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg appearance-none font-medium ${
                                isDark 
                                    ? 'bg-gray-700/80 border-gray-600 hover:border-gray-500 text-gray-100' 
                                    : 'bg-white/80 border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                        >
                            <option value="">Select civil status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Separated">Separated</option>
                        </select>
                    </div>
                </div>

                {/* Spouse Name - conditionally shown */}
                {inputs.civilStatus === 'Married' && (
                    <div className="space-y-3">
                        <label htmlFor="spouseName" className={`block text-sm font-bold tracking-wide ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            Name of Spouse <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="spouseName" 
                            name="spouseName" 
                            value={inputs.spouseName}
                            onChange={this.onChange_input} 
                            required={inputs.civilStatus === 'Married'}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                isDark 
                                    ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                    : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                            }`}
                            placeholder="Enter spouse's full name"
                        />
                    </div>
                )}

                {/* Household Information */}
                <div className="space-y-6">
                    <h4 className={`text-lg font-semibold border-b pb-2 ${
                        isDark 
                            ? 'text-gray-200 border-gray-600' 
                            : 'text-gray-700 border-gray-300'
                    }`}>
                        Household Information <span className="text-red-500">*</span>
                    </h4>
                    
                    {/* Household Members */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label htmlFor="femaleHouseholdMembers" className={`block text-sm font-bold tracking-wide ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Number of Female Household Members
                            </label>
                            <input 
                                type="number" 
                                id="femaleHouseholdMembers" 
                                name="femaleHouseholdMembers" 
                                value={inputs.femaleHouseholdMembers}
                                onChange={this.onChange_input} 
                                min="0"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                        : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                                }`}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="maleHouseholdMembers" className={`block text-sm font-bold tracking-wide ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Number of Male Household Members
                            </label>
                            <input 
                                type="number" 
                                id="maleHouseholdMembers" 
                                name="maleHouseholdMembers" 
                                value={inputs.maleHouseholdMembers}
                                onChange={this.onChange_input} 
                                min="0"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                        : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                                }`}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Household Head Status */}
                    <div className="space-y-4">
                        <label className={`block text-sm font-bold tracking-wide ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            Are you the Household Head? <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`relative flex items-center justify-center py-4 px-5 border-2 rounded-xl cursor-pointer hover:border-green-400 transition-all duration-300 group backdrop-blur-sm ${
                                isDark 
                                    ? 'border-gray-600 hover:bg-green-900/20 bg-gray-700/60' 
                                    : 'border-gray-200 hover:bg-green-50/50 bg-white/60'
                            }`}>
                                <input type="radio" name="isHouseholdHead" value="Yes" checked={inputs.isHouseholdHead === 'Yes'} onChange={this.onChange_input} required className="sr-only" />
                                <div className="flex items-center space-x-3">
                                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.isHouseholdHead === 'Yes' ? 'border-green-500 bg-green-500' : isDark ? 'border-gray-500 group-hover:border-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                        <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.isHouseholdHead === 'Yes' ? 'scale-100' : 'scale-0'}`}></div>
                                    </div>
                                    <span className={`text-sm font-semibold transition-colors duration-300 ${
                                        inputs.isHouseholdHead === 'Yes' 
                                            ? 'text-green-700' 
                                            : isDark 
                                                ? 'text-gray-200 group-hover:text-green-400' 
                                                : 'text-gray-700 group-hover:text-green-700'
                                    }`}>Yes, I am the household head</span>
                                </div>
                            </label>
                            <label className={`relative flex items-center justify-center py-4 px-5 border-2 rounded-xl cursor-pointer hover:border-green-400 transition-all duration-300 group backdrop-blur-sm ${
                                isDark 
                                    ? 'border-gray-600 hover:bg-green-900/20 bg-gray-700/60' 
                                    : 'border-gray-200 hover:bg-green-50/50 bg-white/60'
                            }`}>
                                <input type="radio" name="isHouseholdHead" value="No" checked={inputs.isHouseholdHead === 'No'} onChange={this.onChange_input} required className="sr-only" />
                                <div className="flex items-center space-x-3">
                                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.isHouseholdHead === 'No' ? 'border-green-500 bg-green-500' : isDark ? 'border-gray-500 group-hover:border-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                        <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.isHouseholdHead === 'No' ? 'scale-100' : 'scale-0'}`}></div>
                                    </div>
                                    <span className={`text-sm font-semibold transition-colors duration-300 ${
                                        inputs.isHouseholdHead === 'No' 
                                            ? 'text-green-700' 
                                            : isDark 
                                                ? 'text-gray-200 group-hover:text-green-400' 
                                                : 'text-gray-700 group-hover:text-green-700'
                                    }`}>No</span>
                                </div>
                            </label>
                        </div>

                        {inputs.isHouseholdHead === 'No' && (
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 rounded-2xl border ${
                                isDark 
                                    ? 'bg-gray-800/30 border-gray-600/50' 
                                    : 'bg-green-50/30 border-green-200/50'
                            }`}>
                                <div className="space-y-3">
                                    <label htmlFor="householdHeadName" className={`block text-sm font-bold tracking-wide ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        Name of Household Head <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="householdHeadName" 
                                        name="householdHeadName" 
                                        value={inputs.householdHeadName}
                                        onChange={this.onChange_input} 
                                        required={inputs.isHouseholdHead === 'No'}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                            isDark 
                                                ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                                : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                                        }`}
                                        placeholder="Enter full name of household head"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="relationshipToHead" className={`block text-sm font-bold tracking-wide ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        Relationship to Household Head <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        id="relationshipToHead" 
                                        name="relationshipToHead" 
                                        value={inputs.relationshipToHead}
                                        onChange={this.onChange_input} 
                                        required={inputs.isHouseholdHead === 'No'}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                            isDark 
                                                ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100' 
                                                : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700'
                                        }`}
                                    >
                                        <option value="">Select relationship</option>
                                        <option value="Son">Son</option>
                                        <option value="Daughter">Daughter</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Brother">Brother</option>
                                        <option value="Sister">Sister</option>
                                        <option value="Grandchild">Grandchild</option>
                                        <option value="Son-in-law">Son-in-law</option>
                                        <option value="Daughter-in-law">Daughter-in-law</option>
                                        <option value="Other relative">Other relative</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Government ID */}
                <div className="space-y-6">
                    <h4 className={`text-lg font-semibold border-b pb-2 ${
                        isDark 
                            ? 'text-gray-200 border-gray-600' 
                            : 'text-gray-700 border-gray-300'
                    }`}>
                        Government ID <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <label className={`relative flex items-center justify-center py-4 px-5 border-2 rounded-xl cursor-pointer hover:border-green-400 transition-all duration-300 group backdrop-blur-sm ${
                            isDark 
                                ? 'border-gray-600 hover:bg-green-900/20 bg-gray-700/60' 
                                : 'border-gray-200 hover:bg-green-50/50 bg-white/60'
                        }`}>
                            <input type="radio" name="hasGovId" value="Yes" checked={inputs.hasGovId === 'Yes'} onChange={this.onChange_input} required className="sr-only" />
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.hasGovId === 'Yes' ? 'border-green-500 bg-green-500' : isDark ? 'border-gray-500 group-hover:border-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.hasGovId === 'Yes' ? 'scale-100' : 'scale-0'}`}></div>
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${
                                    inputs.hasGovId === 'Yes' 
                                        ? 'text-green-700' 
                                        : isDark 
                                            ? 'text-gray-200 group-hover:text-green-400' 
                                            : 'text-gray-700 group-hover:text-green-700'
                                }`}>Yes</span>
                            </div>
                        </label>
                        <label className={`relative flex items-center justify-center py-4 px-5 border-2 rounded-xl cursor-pointer hover:border-green-400 transition-all duration-300 group backdrop-blur-sm ${
                            isDark 
                                ? 'border-gray-600 hover:bg-green-900/20 bg-gray-700/60' 
                                : 'border-gray-200 hover:bg-green-50/50 bg-white/60'
                        }`}>
                            <input type="radio" name="hasGovId" value="No" checked={inputs.hasGovId === 'No'} onChange={this.onChange_input} required className="sr-only" />
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.hasGovId === 'No' ? 'border-green-500 bg-green-500' : isDark ? 'border-gray-500 group-hover:border-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.hasGovId === 'No' ? 'scale-100' : 'scale-0'}`}></div>
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${
                                    inputs.hasGovId === 'No' 
                                        ? 'text-green-700' 
                                        : isDark 
                                            ? 'text-gray-200 group-hover:text-green-400' 
                                            : 'text-gray-700 group-hover:text-green-700'
                                }`}>No</span>
                            </div>
                        </label>
                    </div>

                    {inputs.hasGovId === 'Yes' && (
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 rounded-2xl border ${
                            isDark 
                                ? 'bg-gray-800/30 border-gray-600/50' 
                                : 'bg-green-50/30 border-green-200/50'
                        }`}>
                            <div className="space-y-3">
                                <label htmlFor="govIdType" className={`block text-sm font-bold tracking-wide ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    ID Type <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    id="govIdType" 
                                    name="govIdType" 
                                    value={inputs.govIdType}
                                    onChange={this.onChange_input} 
                                    required={inputs.hasGovId === 'Yes'}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                        isDark 
                                            ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100' 
                                            : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700'
                                    }`}
                                >
                                    <option value="">Select ID type</option>
                                    <option value="PhilID">PhilID (National ID)</option>
                                    <option value="SSS">SSS ID</option>
                                    <option value="GSIS">GSIS ID</option>
                                    <option value="Driver's License">Driver's License</option>
                                    <option value="Passport">Passport</option>
                                    <option value="Voter's ID">Voter's ID</option>
                                    <option value="Senior Citizen ID">Senior Citizen ID</option>
                                    <option value="PWD ID">PWD ID</option>
                                    <option value="Postal ID">Postal ID</option>
                                    <option value="PRC ID">PRC ID</option>
                                    <option value="Barangay ID">Barangay ID</option>
                                    <option value="TIN ID">TIN ID</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="govIdNumber" className={`block text-sm font-bold tracking-wide ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    ID Number <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="govIdNumber" 
                                    name="govIdNumber" 
                                    value={inputs.govIdNumber}
                                    onChange={this.onChange_input} 
                                    required={inputs.hasGovId === 'Yes'}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                        isDark 
                                            ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                            : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                                    }`}
                                    placeholder="Enter ID number"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
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
                        <label htmlFor="fname" className={`block text-sm font-bold tracking-wide ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>First Name</label>
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
                        <label htmlFor="lname" className={`block text-sm font-bold tracking-wide ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>Last Name</label>
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
                    <label className={`block text-sm font-bold tracking-wide ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>Gender</label>
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

    renderEducationPWD() {
        const { inputs } = this.state;
        const { isDark } = this.props;
        const educationOptions = [
            'None',
            'Preschool',
            'Elementary Level (Grade 1–6)',
            'Junior High School (K-12)',
            'High School Level (1–4)',
            'Senior High School (K-12)',
            'Vocational',
            'College Level (1–4)',
            'Post Graduate'
        ];

        return (
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); this.onNext(); }}>
                <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${
                        isDark 
                            ? 'from-gray-100 to-gray-300' 
                            : 'from-gray-900 to-gray-700'
                    } bg-clip-text text-transparent mb-3`}>🎓 Education & Disability Information</h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-3"></div>
                    <p className={`font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Select highest education level and disability status</p>
                </div>

                {/* Education Level */}
                <div className="space-y-6">
                    <h4 className={`text-lg font-semibold border-b pb-2 ${
                        isDark 
                            ? 'text-gray-200 border-gray-600' 
                            : 'text-gray-700 border-gray-300'
                    }`}>
                        Highest Formal Education <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {educationOptions.map((option) => (
                            <label key={option} className="relative flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                                <input 
                                    type="radio" 
                                    name="education"
                                    value={option}
                                    checked={inputs.education === option}
                                    onChange={this.onChange_input}
                                    required
                                    className="sr-only" 
                                />
                                <div className="flex items-center space-x-3 w-full">
                                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.education === option ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                        <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.education === option ? 'scale-100' : 'scale-0'}`}></div>
                                    </div>
                                    <span className={`text-sm font-semibold transition-colors duration-300 ${inputs.education === option ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>
                                        {option}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* PWD Status */}
                <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2">
                        Person with Disability (PWD) <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="relative flex items-center justify-center py-4 px-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                            <input type="radio" name="isPWD" value="Yes" checked={inputs.isPWD === 'Yes'} onChange={this.onChange_input} required className="sr-only" />
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.isPWD === 'Yes' ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.isPWD === 'Yes' ? 'scale-100' : 'scale-0'}`}></div>
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${inputs.isPWD === 'Yes' ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>Yes</span>
                            </div>
                        </label>
                        <label className="relative flex items-center justify-center py-4 px-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                            <input type="radio" name="isPWD" value="No" checked={inputs.isPWD === 'No'} onChange={this.onChange_input} required className="sr-only" />
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.isPWD === 'No' ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.isPWD === 'No' ? 'scale-100' : 'scale-0'}`}></div>
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${inputs.isPWD === 'No' ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>No</span>
                            </div>
                        </label>
                    </div>

                    {/* Disability Type - conditionally shown */}
                    {inputs.isPWD === 'Yes' && (
                        <div className="space-y-3">
                            <label htmlFor="disabilityType" className="block text-sm font-bold text-gray-700 tracking-wide">
                                Type of Disability <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="disabilityType" 
                                name="disabilityType" 
                                value={inputs.disabilityType}
                                onChange={this.onChange_input} 
                                required={inputs.isPWD === 'Yes'}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                        : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                                }`}
                                placeholder="Please specify type of disability"
                            />
                        </div>
                    )}
                </div>

                {/* Navigation */}
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

    renderLivelihood() {
        const { inputs } = this.state;
        const { isDark } = this.props;

        return (
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); this.onNext(); }}>
                <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${
                        isDark 
                            ? 'from-gray-100 to-gray-300' 
                            : 'from-gray-900 to-gray-700'
                    } bg-clip-text text-transparent mb-3`}>🌾 Main Livelihood Profile</h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-3"></div>
                    <p className={`font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Select your main source of livelihood and activities</p>
                </div>

                {/* Main Livelihood Profile */}
                <div className="space-y-6">
                    <h4 className={`text-lg font-semibold border-b pb-2 ${
                        isDark 
                            ? 'text-gray-200 border-gray-600' 
                            : 'text-gray-700 border-gray-300'
                    }`}>
                        Main Livelihood <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Farmer */}
                        <label className="relative flex flex-col p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                            <div className="flex items-center space-x-3 mb-3">
                                <input 
                                    type="checkbox" 
                                    name="livelihoodProfile"
                                    value="Farmer"
                                    checked={inputs.livelihoodProfile.includes('Farmer')}
                                    onChange={(e) => this.handleCheckboxChange('livelihoodProfile', 'Farmer', e.target.checked)}
                                    className="sr-only" 
                                />
                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-300 ${inputs.livelihoodProfile.includes('Farmer') ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    {inputs.livelihoodProfile.includes('Farmer') && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${inputs.livelihoodProfile.includes('Farmer') ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>
                                    Farmer
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">Individuals engaged in crop production, livestock raising, or both for commercial or subsistence purposes.</p>
                            {inputs.livelihoodProfile.includes('Farmer') && (
                                <div className="ml-8 space-y-3">
                                    <p className="text-xs font-semibold text-gray-600">Type of Farming Activity:</p>
                                    {['Rice', 'Corn'].map((activity) => (
                                        <label key={activity} className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value={activity}
                                                checked={inputs.farmingActivities.includes(activity)}
                                                onChange={(e) => this.handleCheckboxChange('farmingActivities', activity, e.target.checked)}
                                                className="w-3 h-3 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                                            />
                                            <span className="text-xs text-gray-700">{activity}</span>
                                        </label>
                                    ))}
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="Other Crops"
                                            checked={inputs.farmingActivities.includes('Other Crops')}
                                            onChange={(e) => this.handleCheckboxChange('farmingActivities', 'Other Crops', e.target.checked)}
                                            className="w-3 h-3 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                                        />
                                        <span className="text-xs text-gray-700">Other Crops</span>
                                    </label>
                                    {inputs.farmingActivities.includes('Other Crops') && (
                                        <input 
                                            type="text"
                                            name="otherCropsSpecify"
                                            value={inputs.otherCropsSpecify}
                                            onChange={this.onChange_input}
                                            placeholder="Specify other crops"
                                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    )}
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="Livestock/Poultry"
                                            checked={inputs.farmingActivities.includes('Livestock/Poultry')}
                                            onChange={(e) => this.handleCheckboxChange('farmingActivities', 'Livestock/Poultry', e.target.checked)}
                                            className="w-3 h-3 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                                        />
                                        <span className="text-xs text-gray-700">Livestock/Poultry</span>
                                    </label>
                                    {inputs.farmingActivities.includes('Livestock/Poultry') && (
                                        <input 
                                            type="text"
                                            name="livestockSpecify"
                                            value={inputs.livestockSpecify}
                                            onChange={this.onChange_input}
                                            placeholder="Specify livestock/poultry"
                                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    )}
                                </div>
                            )}
                        </label>

                        {/* Fisherfolk */}
                        <label className="relative flex flex-col p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                            <div className="flex items-center space-x-3 mb-3">
                                <input 
                                    type="checkbox" 
                                    name="livelihoodProfile"
                                    value="Fisherfolk"
                                    checked={inputs.livelihoodProfile.includes('Fisherfolk')}
                                    onChange={(e) => this.handleCheckboxChange('livelihoodProfile', 'Fisherfolk', e.target.checked)}
                                    className="sr-only" 
                                />
                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-300 ${inputs.livelihoodProfile.includes('Fisherfolk') ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    {inputs.livelihoodProfile.includes('Fisherfolk') && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${inputs.livelihoodProfile.includes('Fisherfolk') ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>
                                    Fisherfolk
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">Individuals engaged in fishing activities including fish capture, aquaculture, and fish processing/marketing.</p>
                            {inputs.livelihoodProfile.includes('Fisherfolk') && (
                                <div className="ml-8 space-y-3">
                                    <p className="text-xs font-semibold text-gray-600">Type of Fishing Activity:</p>
                                    {['Fish Capture', 'Fish Farming', 'Fish Vending'].map((activity) => (
                                        <label key={activity} className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value={activity}
                                                checked={inputs.fishingActivities.includes(activity)}
                                                onChange={(e) => this.handleCheckboxChange('fishingActivities', activity, e.target.checked)}
                                                className="w-3 h-3 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                                            />
                                            <span className="text-xs text-gray-700">{activity}</span>
                                        </label>
                                    ))}
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="Others"
                                            checked={inputs.fishingActivities.includes('Others')}
                                            onChange={(e) => this.handleCheckboxChange('fishingActivities', 'Others', e.target.checked)}
                                            className="w-3 h-3 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                                        />
                                        <span className="text-xs text-gray-700">Others</span>
                                    </label>
                                    {inputs.fishingActivities.includes('Others') && (
                                        <input 
                                            type="text"
                                            name="fishingOthersSpecify"
                                            value={inputs.fishingOthersSpecify}
                                            onChange={this.onChange_input}
                                            placeholder="Specify other fishing activity"
                                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    )}
                                </div>
                            )}
                        </label>

                        {/* Farmworker/Laborer */}
                        <label className="relative flex flex-col p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                            <div className="flex items-center space-x-3 mb-3">
                                <input 
                                    type="checkbox" 
                                    name="livelihoodProfile"
                                    value="Farmworker/Laborer"
                                    checked={inputs.livelihoodProfile.includes('Farmworker/Laborer')}
                                    onChange={(e) => this.handleCheckboxChange('livelihoodProfile', 'Farmworker/Laborer', e.target.checked)}
                                    className="sr-only" 
                                />
                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-300 ${inputs.livelihoodProfile.includes('Farmworker/Laborer') ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    {inputs.livelihoodProfile.includes('Farmworker/Laborer') && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${inputs.livelihoodProfile.includes('Farmworker/Laborer') ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>
                                    Farmworker/Laborer
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">Individuals who work on farms owned by others, providing labor for various agricultural activities and operations.</p>
                            {inputs.livelihoodProfile.includes('Farmworker/Laborer') && (
                                <div className="ml-8 space-y-3">
                                    <p className="text-xs font-semibold text-gray-600">Kind of Work:</p>
                                    {['Land Preparation', 'Cultivation', 'Harvesting'].map((activity) => (
                                        <label key={activity} className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value={activity}
                                                checked={inputs.farmworkActivities.includes(activity)}
                                                onChange={(e) => this.handleCheckboxChange('farmworkActivities', activity, e.target.checked)}
                                                className="w-3 h-3 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                                            />
                                            <span className="text-xs text-gray-700">{activity}</span>
                                        </label>
                                    ))}
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="Others"
                                            checked={inputs.farmworkActivities.includes('Others')}
                                            onChange={(e) => this.handleCheckboxChange('farmworkActivities', 'Others', e.target.checked)}
                                            className="w-3 h-3 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                                        />
                                        <span className="text-xs text-gray-700">Others</span>
                                    </label>
                                    {inputs.farmworkActivities.includes('Others') && (
                                        <input 
                                            type="text"
                                            name="farmworkOthersSpecify"
                                            value={inputs.farmworkOthersSpecify}
                                            onChange={this.onChange_input}
                                            placeholder="Specify other farmwork"
                                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    )}
                                </div>
                            )}
                        </label>

                        {/* Agri Youth */}
                        <label className="relative flex flex-col p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                            <div className="flex items-center space-x-3 mb-3">
                                <input 
                                    type="checkbox" 
                                    name="livelihoodProfile"
                                    value="Agri Youth"
                                    checked={inputs.livelihoodProfile.includes('Agri Youth')}
                                    onChange={(e) => this.handleCheckboxChange('livelihoodProfile', 'Agri Youth', e.target.checked)}
                                    className="sr-only" 
                                />
                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-300 ${inputs.livelihoodProfile.includes('Agri Youth') ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                    {inputs.livelihoodProfile.includes('Agri Youth') && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${inputs.livelihoodProfile.includes('Agri Youth') ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>
                                    Agri Youth
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">Young individuals (15-30 years old) involved in agriculture for training purposes, financial assistance, and programs catered to youth in agricultural activities.</p>
                            {inputs.livelihoodProfile.includes('Agri Youth') && (
                                <div className="ml-8 space-y-3">
                                    <p className="text-xs font-semibold text-gray-600">Type of Involvement:</p>
                                    {['Home-based', 'School-based', 'Community-based'].map((activity) => (
                                        <label key={activity} className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value={activity}
                                                checked={inputs.youthActivities.includes(activity)}
                                                onChange={(e) => this.handleCheckboxChange('youthActivities', activity, e.target.checked)}
                                                className="w-3 h-3 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                                            />
                                            <span className="text-xs text-gray-700">{activity}</span>
                                        </label>
                                    ))}
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="Others"
                                            checked={inputs.youthActivities.includes('Others')}
                                            onChange={(e) => this.handleCheckboxChange('youthActivities', 'Others', e.target.checked)}
                                            className="w-3 h-3 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                                        />
                                        <span className="text-xs text-gray-700">Others</span>
                                    </label>
                                    {inputs.youthActivities.includes('Others') && (
                                        <input 
                                            type="text"
                                            name="youthOthersSpecify"
                                            value={inputs.youthOthersSpecify}
                                            onChange={this.onChange_input}
                                            placeholder="Specify other involvement"
                                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    )}
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* Gross Annual Income */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label htmlFor="grossAnnualIncome" className="block text-sm font-bold text-gray-700 tracking-wide">
                            💰 Gross Annual Income Last Year (Pesos) <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="number" 
                            id="grossAnnualIncome" 
                            name="grossAnnualIncome" 
                            value={inputs.grossAnnualIncome}
                            onChange={this.onChange_input} 
                            required 
                            min="0"
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 backdrop-blur-sm transition-all duration-300 font-medium ${
                                isDark 
                                    ? 'border-gray-600 bg-gray-800/80 hover:border-gray-500 hover:shadow-lg text-gray-100 placeholder-gray-400' 
                                    : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-lg text-gray-700 placeholder-gray-400'
                            }`}
                            placeholder="Enter gross annual income in pesos"
                        />
                    </div>

                    {/* Income Source */}
                    <div className="space-y-3">
                        <label htmlFor="incomeSource" className="block text-sm font-bold text-gray-700 tracking-wide">
                            Income Source <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="relative flex items-center justify-center py-4 px-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                                <input type="radio" name="incomeSource" value="Farming" checked={inputs.incomeSource === 'Farming'} onChange={this.onChange_input} required className="sr-only" />
                                <div className="flex items-center space-x-3">
                                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.incomeSource === 'Farming' ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                        <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.incomeSource === 'Farming' ? 'scale-100' : 'scale-0'}`}></div>
                                    </div>
                                    <span className={`text-sm font-semibold transition-colors duration-300 ${inputs.incomeSource === 'Farming' ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>Farming</span>
                                </div>
                            </label>
                            <label className="relative flex items-center justify-center py-4 px-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/60">
                                <input type="radio" name="incomeSource" value="Non-farming" checked={inputs.incomeSource === 'Non-farming'} onChange={this.onChange_input} required className="sr-only" />
                                <div className="flex items-center space-x-3">
                                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${inputs.incomeSource === 'Non-farming' ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-green-500'}`}>
                                        <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all duration-300 ${inputs.incomeSource === 'Non-farming' ? 'scale-100' : 'scale-0'}`}></div>
                                    </div>
                                    <span className={`text-sm font-semibold transition-colors duration-300 ${inputs.incomeSource === 'Non-farming' ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>Non-farming</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
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

    renderAccountSetup() {
        const { inputs, isLoading } = this.state;
        const { isDark } = this.props;

        return (
            <form className="space-y-8" onSubmit={this.post_account}>
                <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${
                        isDark 
                            ? 'from-gray-100 to-gray-300' 
                            : 'from-gray-900 to-gray-700'
                    } bg-clip-text text-transparent mb-3`}>🔐 Account Setup</h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-3"></div>
                    <p className={`font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Create login credentials for the RSBSA account</p>
                </div>

                <div className="space-y-3">
                    <label htmlFor="email" className={`block text-sm font-bold tracking-wide ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                        Email Address <span className="text-red-500">*</span>
                    </label>
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
                    <label htmlFor="username" className="block text-sm font-bold text-gray-700 tracking-wide">
                        Username <span className="text-red-500">*</span>
                    </label>
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
                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 tracking-wide">
                        Password <span className="text-red-500">*</span>
                    </label>
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
                    <label htmlFor="confirmPass" className="block text-sm font-bold text-gray-700 tracking-wide">
                        Confirm Password <span className="text-red-500">*</span>
                    </label>
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

                {/* Profile Photo Upload */}
                <div className="space-y-3">
                    <label htmlFor="profilePhoto" className="block text-sm font-bold text-gray-700 tracking-wide">
                        Profile Picture <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input 
                            type="file" 
                            id="profilePhoto" 
                            name="profilePhoto" 
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={this.handleFileUpload}
                            required
                            className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg font-medium text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                    </div>
                    <p className="text-sm text-gray-500 font-medium flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Maximum file size: 5MB. Accepted formats: JPEG, JPG, PNG</span>
                    </p>
                    {inputs.profilePhoto && (
                        <div className="flex items-center space-x-3 mt-3 p-3 rounded-xl backdrop-blur-sm text-green-700 bg-green-50/80 border border-green-200">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm font-semibold">✓ Photo uploaded: {inputs.profilePhoto.name}</span>
                        </div>
                    )}
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
                                    <span>Creating RSBSA Account...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Create RSBSA Account</span>
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
