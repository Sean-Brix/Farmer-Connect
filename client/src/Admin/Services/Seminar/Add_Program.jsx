import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../../contexts/ThemeContext';
import default_seminar_pic from '../../../Assets/default_seminar_pic.jpg';

export default function Add_Program({
    setShowAdd,
    search,
    searchFilter,
    statusFilter,
}) {
    const { isDark } = useTheme();
    const [newProgram, setNewProgram] = useState({
        title: '',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        openTime: '',
        closeTime: '',
        capacity: '',
        speaker: '',
        registrationDeadline: '',
        photo: null,
    });

    const [newImage, setNewImage] = useState(default_seminar_pic);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data) => {
            const response = await fetch('/api/seminar/add', {
                method: 'POST',
                body: data,
            });
            if (!response.ok) {
                const errorData = await response.json();
                
                // If validation errors exist, format them nicely
                if (errorData.payload?.errors) {
                    const errorMessages = errorData.payload.errors.join('\n• ');
                    throw new Error(`Validation Errors:\n• ${errorMessages}`);
                }
                
                throw new Error(
                    errorData.payload?.Error || 'Failed to add program'
                );
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['seminars', search, searchFilter, statusFilter],
            });
            setShowAdd(false);
        },
        onError: (error) => {
            console.error('Error adding program:', error.message);
            
            // Display formatted error message
            alert(error.message);
        },
    });
    
    // Validate form data
    const validateForm = () => {
        const errors = {};
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        // Validate capacity
        if (!newProgram.capacity || newProgram.capacity < 1) {
            errors.capacity = 'Capacity must be at least 1';
        }
        
        // Validate dates and times exist
        if (!newProgram.startDate) {
            errors.startDate = 'Start date is required';
        }
        if (!newProgram.endDate) {
            errors.endDate = 'End date is required';
        }
        if (!newProgram.registrationDeadline) {
            errors.registrationDeadline = 'Registration deadline is required';
        }
        if (!newProgram.openTime) {
            errors.openTime = 'Start time is required';
        }
        if (!newProgram.closeTime) {
            errors.closeTime = 'End time is required';
        }
        
        // Validate date logic if all dates are present
        if (newProgram.startDate && newProgram.endDate && newProgram.registrationDeadline) {
            const startDate = new Date(newProgram.startDate);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(newProgram.endDate);
            endDate.setHours(0, 0, 0, 0);
            const regDeadline = new Date(newProgram.registrationDeadline);
            regDeadline.setHours(0, 0, 0, 0);
            
            // Start date cannot be in the past
            if (startDate < currentDate) {
                errors.startDate = 'Start date cannot be in the past';
            }
            
            // End date must be on or after start date
            if (endDate < startDate) {
                errors.endDate = 'End date must be on or after start date';
            }
            
            // Registration deadline must be before start date
            if (regDeadline >= startDate) {
                errors.registrationDeadline = 'Registration deadline must be before start date';
            }
            
            // Validate times for same-day events
            if (newProgram.openTime && newProgram.closeTime && startDate.getTime() === endDate.getTime()) {
                if (newProgram.closeTime <= newProgram.openTime) {
                    errors.closeTime = 'End time must be after start time on same-day events';
                }
            }
        }
        
        // Always validate times if both are present
        if (newProgram.openTime && newProgram.closeTime) {
            const startDate = newProgram.startDate ? new Date(newProgram.startDate) : null;
            const endDate = newProgram.endDate ? new Date(newProgram.endDate) : null;
            
            const shouldValidateTimes = !startDate || !endDate || 
                                       (startDate.getTime() === endDate.getTime());
            
            if (shouldValidateTimes && newProgram.closeTime <= newProgram.openTime) {
                errors.closeTime = 'End time must be after start time';
            }
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    // Run validation whenever relevant fields change
    useEffect(() => {
        validateForm();
    }, [newProgram.capacity, newProgram.startDate, newProgram.endDate, 
        newProgram.registrationDeadline, newProgram.openTime, newProgram.closeTime]);

    const handleAddProgram = async (e) => {
        e.preventDefault();
        
        // Validate before submitting
        if (!validateForm()) {
            alert('Please fix all validation errors before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('title', newProgram.title);
        formData.append('description', newProgram.description);
        formData.append('location', newProgram.location);
        formData.append('start_date', newProgram.startDate);
        formData.append('end_date', newProgram.endDate);
        formData.append('start_time', newProgram.openTime);
        formData.append('end_time', newProgram.closeTime);
        formData.append('capacity', newProgram.capacity);
        formData.append('speaker', newProgram.speaker);
        formData.append('registration_deadline', newProgram.registrationDeadline);

        if (newImage && typeof newImage !== 'string') {
            formData.append('photo', newImage);
        }

        mutation.mutate(formData);
    };

    const changeImage = (event) => {
        const file = event.target.files[0];

        if (file) {
            setNewImage(file);
        } else {
            setNewImage(default_seminar_pic);
        }
    };

    return (
        <>
            {/* Remove browser autofill background for inputs */}
            <style>{`
                input:-webkit-autofill,
                input:-webkit-autofill:focus,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:active {
                    -webkit-box-shadow: none !important;
                    box-shadow: none !important;
                    -webkit-background-clip: text !important;
                    background-clip: text !important;
                    transition: background-color 5000s ease-in-out 0s !important;
                    -webkit-text-fill-color: inherit !important;
                }
                input[autocomplete="off"] {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                }
            `}</style>
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-2 sm:px-4">
                <form
                    className={`rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] relative border flex flex-col overflow-hidden ${
                        isDark 
                            ? 'bg-gray-800 border-gray-600' 
                            : 'bg-white border-green-200'
                    }`}
                    onSubmit={handleAddProgram}
                    style={{ minWidth: 320 }}
                >
                    {/* Header */}
                    <div className={`flex justify-between items-center border-b px-6 py-4 rounded-t-xl ${
                        isDark 
                            ? 'border-gray-600 bg-gray-800' 
                            : 'border-gray-200 bg-gray-50'
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h2 className={`text-xl font-bold ${
                                isDark ? 'text-gray-100' : 'text-gray-800'
                            }`}>Add New Seminar</h2>
                        </div>
                        <button
                            type="button"
                            className={`p-2 rounded-lg transition-colors ${
                                isDark 
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600' 
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                            onClick={() => setShowAdd(false)}
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto flex-1">
                        {/* Validation Error Summary */}
                        {Object.keys(validationErrors).length > 0 && (
                            <div className="mb-6 rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-900/20 p-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                                            Please fix the following errors before submitting:
                                        </h3>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-400">
                                            {Object.entries(validationErrors).map(([field, error]) => (
                                                <li key={field}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Combined Information Box */}
                        <div className="mb-6">
                            <div className={`rounded-xl p-6 border ${
                                isDark 
                                    ? 'bg-gray-800 border-gray-600' 
                                    : 'bg-white border-gray-200'
                            }`}>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-1.5 bg-green-600 rounded-lg">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className={`text-lg font-semibold ${
                                        isDark ? 'text-gray-100' : 'text-gray-800'
                                    }`}>Seminar Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Basic Information Section */}
                                    <div className="lg:col-span-3">
                                        <h4 className={`text-md font-medium mb-4 ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>Basic Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className={`block text-sm font-medium mb-2 ${
                                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                                }`}>Title</label>
                                                <input
                                                    type="text"
                                                    className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition ${
                                                        isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                            : 'border-green-300 bg-white text-gray-900'
                                                    }`}
                                                    value={newProgram.title}
                                                    onChange={(e) =>
                                                        setNewProgram({
                                                            ...newProgram,
                                                            title: e.target.value,
                                                        })
                                                    }
                                                    required
                                                    autoFocus
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${
                                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                                }`}>Location</label>
                                                <input
                                                    type="text"
                                                    className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition ${
                                                        isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                            : 'border-green-300 bg-white text-gray-900'
                                                    }`}
                                                    value={newProgram.location}
                                                    onChange={(e) =>
                                                        setNewProgram({
                                                            ...newProgram,
                                                            location: e.target.value,
                                                        })
                                                    }
                                                    required
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${
                                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                                }`}>Maximum Participants</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition ${
                                                        isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                            : 'border-green-300 bg-white text-gray-900'
                                                    }`}
                                                    value={newProgram.capacity}
                                                    onChange={(e) =>
                                                        setNewProgram({
                                                            ...newProgram,
                                                            capacity: e.target.value,
                                                        })
                                                    }
                                                    required
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className={`block text-sm font-medium mb-2 ${
                                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                                }`}>Description</label>
                                                <textarea
                                                    className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition resize-none ${
                                                        isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                            : 'border-green-300 bg-white text-gray-900'
                                                    }`}
                                                    value={newProgram.description}
                                                    onChange={(e) =>
                                                        setNewProgram({
                                                            ...newProgram,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    required
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Speaker Section */}
                                    <div className="lg:col-span-1">
                                        <h4 className={`text-md font-medium mb-4 ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>Speaker</h4>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDark ? 'text-gray-200' : 'text-gray-800'
                                            }`}>Speaker Name</label>
                                            <input
                                                type="text"
                                                className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition ${
                                                    isDark 
                                                        ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                        : 'border-green-300 bg-white text-gray-900'
                                                }`}
                                                value={newProgram.speaker}
                                                onChange={(e) =>
                                                    setNewProgram({
                                                        ...newProgram,
                                                        speaker: e.target.value,
                                                    })
                                                }
                                                required
                                                placeholder="Enter speaker name"
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    {/* Schedule Section */}
                                    <div className="lg:col-span-2">
                                        <h4 className={`text-md font-medium mb-4 ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>Schedule</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                            <div>
                                                <label className={`block text-xs font-medium mb-1 ${
                                                    isDark ? 'text-gray-300' : 'text-gray-800'
                                                }`}>Start Date</label>
                                                <input
                                                    type="date"
                                                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition text-sm ${
                                                        isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                            : 'border-green-300 bg-white text-gray-900'
                                                    }`}
                                                    value={newProgram.startDate}
                                                    onChange={(e) =>
                                                        setNewProgram({
                                                            ...newProgram,
                                                            startDate: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-medium mb-1 ${
                                                    isDark ? 'text-gray-300' : 'text-gray-800'
                                                }`}>End Date</label>
                                                <input
                                                    type="date"
                                                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition text-sm ${
                                                        isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                            : 'border-green-300 bg-white text-gray-900'
                                                    }`}
                                                    value={newProgram.endDate}
                                                    onChange={(e) =>
                                                        setNewProgram({
                                                            ...newProgram,
                                                            endDate: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-medium mb-1 ${
                                                    isDark ? 'text-gray-300' : 'text-gray-800'
                                                }`}>Start Time</label>
                                                <input
                                                    type="time"
                                                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition text-sm ${
                                                        isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                            : 'border-green-300 bg-white text-gray-900'
                                                    }`}
                                                    value={newProgram.openTime}
                                                    onChange={(e) =>
                                                        setNewProgram({
                                                            ...newProgram,
                                                            openTime: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-medium mb-1 ${
                                                    isDark ? 'text-gray-300' : 'text-gray-800'
                                                }`}>End Time</label>
                                                <input
                                                    type="time"
                                                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition text-sm ${
                                                        isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                            : 'border-green-300 bg-white text-gray-900'
                                                    }`}
                                                    value={newProgram.closeTime}
                                                    onChange={(e) =>
                                                        setNewProgram({
                                                            ...newProgram,
                                                            closeTime: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDark ? 'text-gray-300' : 'text-gray-800'
                                            }`}>Registration Deadline</label>
                                            <input
                                                type="date"
                                                className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition ${
                                                    isDark 
                                                        ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                        : 'border-green-300 bg-white text-gray-900'
                                                }`}
                                                value={newProgram.registrationDeadline}
                                                onChange={(e) =>
                                                    setNewProgram({
                                                        ...newProgram,
                                                        registrationDeadline: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload Section - Below */}
                        <div className={`rounded-xl p-6 border ${
                            isDark 
                                ? 'bg-gray-800 border-gray-600' 
                                : 'bg-white border-gray-200'
                        }`}>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-green-600 rounded-lg">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className={`text-lg font-semibold ${
                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                }`}>Seminar Image</h3>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDark ? 'text-gray-300' : 'text-gray-800'
                                    }`}>Upload Image <span className={`text-xs ${
                                        isDark ? 'text-gray-500' : 'text-gray-500'
                                    }`}>(optional)</span></label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm ${
                                            isDark 
                                                ? 'border-gray-600 bg-gray-800 text-gray-100 file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600' 
                                                : 'border-green-300 bg-white text-gray-900 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200'
                                        }`}
                                        onChange={changeImage}
                                    />
                                </div>
                                <div className="flex flex-col items-center space-y-3">
                                    <img
                                        src={typeof newImage === 'string' ? newImage : URL.createObjectURL(newImage)}
                                        alt="Seminar Preview"
                                        className={`w-full max-w-[250px] h-auto object-cover rounded-xl border shadow-sm cursor-pointer transition-opacity hover:opacity-90 ${
                                            isDark 
                                                ? 'bg-gray-700 border-gray-600' 
                                                : 'bg-white border-gray-300'
                                        }`}
                                        onClick={() => setShowImagePreview(true)}
                                        onError={(e) => {
                                            e.target.src = default_seminar_pic;
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowImagePreview(true)}
                                        className="bg-black/70 text-white px-3 py-1.5 rounded-lg hover:bg-opacity-80 transition-all text-sm font-medium"
                                        title="Preview Image"
                                    >
                                        Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`border-t px-6 py-4 flex justify-end gap-3 rounded-b-xl ${
                        isDark 
                            ? 'border-gray-600 bg-gray-700' 
                            : 'border-gray-200 bg-white'
                    }`}>
                        <button
                            type="button"
                            onClick={() => setShowAdd(false)}
                            className={`px-6 py-2.5 font-medium rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${
                                isDark 
                                    ? 'bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500 focus:ring-gray-400' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 focus:ring-gray-300'
                            }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending || Object.keys(validationErrors).length > 0}
                            className={`px-6 py-2.5 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 shadow-sm ${
                                mutation.isPending || Object.keys(validationErrors).length > 0
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-400'
                            }`}
                            title={Object.keys(validationErrors).length > 0 ? 'Please fix all validation errors' : 'Add seminar'}
                        >
                            {mutation.isPending ? 'Adding...' : 'Add Seminar'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Image Preview Modal */}
            {showImagePreview && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setShowImagePreview(false)}
                            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-all z-10"
                            title="Close Preview"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={typeof newImage === 'string' ? newImage : URL.createObjectURL(newImage)}
                            alt="Seminar Image Preview"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onError={(e) => {
                                e.target.src = default_seminar_pic;
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
