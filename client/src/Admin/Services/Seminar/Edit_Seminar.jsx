import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import default_picture from '../../../Assets/default_seminar_pic.jpg';

export default function Edit_Seminar({ data, toggleOff, setProgramList }) {
    const { isDark } = useTheme();
    
    // Format dates from DateTime/ISO string to YYYY-MM-DD for date inputs
    const formatDateForInput = (dateValue) => {
        if (!dateValue) return '';
        
        // Handle ISO string dates (like "2025-11-07T00:00:00.000Z")
        if (typeof dateValue === 'string') {
            return dateValue.split('T')[0];
        }
        
        // Handle Date objects
        try {
            const date = new Date(dateValue);
            return date.toISOString().split('T')[0];
        } catch (e) {
            console.error('Error formatting date:', dateValue, e);
            return '';
        }
    };

    // Use useMemo to format dates when data changes
    const initialData = useMemo(() => {
        return {
            ...data,
            start_date: formatDateForInput(data.start_date),
            end_date: formatDateForInput(data.end_date),
            registration_deadline: formatDateForInput(data.registration_deadline),
        };
    }, [data]);
    
    // Render editing data
    const [newData, setNewData] = useState(initialData);
    const [image, setImage] = useState(data.photo);
    const [newImage, setNewImage] = useState(null);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const changedImage = useRef(false);
    
    // Validation state
    const [validationErrors, setValidationErrors] = useState({});

    // Update newData when initialData changes
    useEffect(() => {
        setNewData(initialData);
    }, [initialData]);
    
    // Validate form data
    const validateForm = () => {
        const errors = {};
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        // Validate capacity
        if (!newData.capacity || newData.capacity < 1) {
            errors.capacity = 'Capacity must be at least 1';
        }
        
        // Validate dates exist
        if (!newData.start_date) {
            errors.start_date = 'Start date is required';
        }
        if (!newData.end_date) {
            errors.end_date = 'End date is required';
        }
        if (!newData.registration_deadline) {
            errors.registration_deadline = 'Registration deadline is required';
        }
        if (!newData.start_time) {
            errors.start_time = 'Start time is required';
        }
        if (!newData.end_time) {
            errors.end_time = 'End time is required';
        }
        
        // Only validate date logic if all dates are present
        if (newData.start_date && newData.end_date && newData.registration_deadline) {
            const startDate = new Date(newData.start_date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(newData.end_date);
            endDate.setHours(0, 0, 0, 0);
            const regDeadline = new Date(newData.registration_deadline);
            regDeadline.setHours(0, 0, 0, 0);
            
            // For upcoming seminars, start date cannot be in the past
            if (newData.status === 'Upcoming' && startDate < currentDate) {
                errors.start_date = 'Start date cannot be in the past for upcoming seminars';
            }
            
            // End date must be on or after start date
            if (endDate < startDate) {
                errors.end_date = 'End date must be on or after start date';
            }
            
            // Registration deadline must be before start date
            if (regDeadline >= startDate) {
                errors.registration_deadline = 'Registration deadline must be before start date';
            }
            
            // Validate times for same-day events
            if (newData.start_time && newData.end_time && startDate.getTime() === endDate.getTime()) {
                if (newData.end_time <= newData.start_time) {
                    errors.end_time = 'End time must be after start time on same-day events';
                }
            }
            
            // For multi-day events, just check that times are valid format (no additional validation needed)
        }
        
        // Always validate times if both are present - regardless of dates
        // This catches illogical times like 9am end, 5pm start
        if (newData.start_time && newData.end_time) {
            // For same-day or unknown date situations, end time must be after start time
            const startDate = newData.start_date ? new Date(newData.start_date) : null;
            const endDate = newData.end_date ? new Date(newData.end_date) : null;
            
            // Only validate time order if same day OR dates not set OR dates are same
            const shouldValidateTimes = !startDate || !endDate || 
                                       (startDate.getTime() === endDate.getTime());
            
            if (shouldValidateTimes && newData.end_time <= newData.start_time) {
                errors.end_time = 'End time must be after start time';
            }
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    // Run validation whenever relevant fields change
    useEffect(() => {
        validateForm();
    }, [newData]);

    // Save the record
    const saveSeminar = async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            alert('Please fix all validation errors before submitting.');
            return;
        }

        try {
            // Create FormData for file upload support
            const formData = new FormData();

            // Add all the form fields
            Object.keys(newData).forEach((key) => {
                if (newData[key] !== null && newData[key] !== undefined) {
                    formData.append(key, newData[key]);
                }
            });

            // Add the photo if it was changed
            if (changedImage.current && newImage) {
                formData.append('photo', newImage);
            }

            const response = await fetch(`/api/seminar/update/${newData.id}`, {
                method: 'PUT',
                body: formData, // Send as FormData, not JSON
            });

            if (!response.ok) {
                const data = await response.json();

                console.error(
                    'Failed to update seminar:',
                    response.status,
                    response.statusText,
                    data.error || data.payload?.error
                );

                alert('Failed to update seminar. Please try again.');
                return;
            }

            // Success - the photo was already handled in the main update request
            const responseData = await response.json();

            setProgramList((prev) => {
                const index = prev.findIndex((item) => item.id === newData.id);
                if (index !== -1) {
                    const updatedList = [...prev];
                    updatedList[index] = {
                        ...newData,
                        photo: changedImage.current
                            ? URL.createObjectURL(newImage)
                            : image,
                    };
                    return updatedList;
                } else {
                    return [newData, ...prev];
                }
            });

            toggleOff();
        } catch (error) {
            console.error('Error updating seminar:', error);
            alert(
                'An error occurred while updating the seminar. Please try again.'
            );
        }
    };

    // Change image
    const changeImage = (event) => {
        event.preventDefault();

        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);

            setNewImage(file);
            changedImage.current = true;
        } else {
            // Revert to default if no file selected
            setImage(default_picture);
            changedImage.current = false;
        }
    };

    return (
        <>
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-2 sm:px-4">
            <form
                className={`rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col ${
                    isDark 
                        ? 'bg-gray-800 border border-gray-600' 
                        : 'bg-white border border-gray-200'
                }`}
                onSubmit={saveSeminar}
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
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h2 className={`text-xl font-bold ${
                            isDark ? 'text-gray-200' : 'text-green-800'
                        }`}>Edit Seminar</h2>
                    </div>
                    <button
                        type="button"
                        className={`p-2 rounded-lg transition-colors ${
                            isDark 
                                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleOff()}
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Status Warning for Completed/Cancelled */}
                    {(newData.status === 'Completed' || newData.status === 'Cancelled') && (
                        <div className={`mb-6 rounded-lg border-2 p-4 ${
                            newData.status === 'Completed'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        }`}>
                            <div className="flex items-start gap-3">
                                <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                    newData.status === 'Completed'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-orange-600 dark:text-orange-400'
                                }`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h3 className={`text-sm font-semibold mb-1 ${
                                        newData.status === 'Completed'
                                            ? 'text-blue-800 dark:text-blue-300'
                                            : 'text-orange-800 dark:text-orange-300'
                                    }`}>
                                        {newData.status === 'Completed' ? 'Completed Seminar' : 'Cancelled Seminar'}
                                    </h3>
                                    <p className={`text-sm ${
                                        newData.status === 'Completed'
                                            ? 'text-blue-700 dark:text-blue-400'
                                            : 'text-orange-700 dark:text-orange-400'
                                    }`}>
                                        This seminar is {newData.status.toLowerCase()}. Consider the impact of any changes carefully.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Validation Error Summary */}
                    {Object.keys(validationErrors).length > 0 && (
                        <div className="mb-6 rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-900/20 p-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDark ? 'text-gray-300' : 'text-green-700'
                                            }`}>Status</label>
                                            <select
                                                onChange={(e) => setNewData({ ...newData, status: e.target.value })}
                                                className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition ${
                                                    isDark 
                                                        ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                        : 'border-green-300 bg-white text-gray-900'
                                                }`}
                                                value={newData.status}
                                                autoComplete="off"
                                            >
                                                <option value="Upcoming">Upcoming</option>
                                                <option value="Ongoing">Ongoing</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDark ? 'text-gray-300' : 'text-green-700'
                                            }`}>Maximum Participants</label>
                                            <input
                                                type="number"
                                                min="1"
                                                className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition ${
                                                    validationErrors.capacity
                                                        ? 'border-red-500 focus:ring-red-400'
                                                        : isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100 focus:ring-green-400' 
                                                            : 'border-green-300 bg-white text-gray-900 focus:ring-green-400'
                                                }`}
                                                value={newData.capacity}
                                                onChange={(e) => setNewData({ ...newData, capacity: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                            {validationErrors.capacity && (
                                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {validationErrors.capacity}
                                                </p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDark ? 'text-gray-300' : 'text-gray-800'
                                            }`}>Title</label>
                                            <input
                                                type="text"
                                                className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition ${
                                                    isDark 
                                                        ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                        : 'border-green-300 bg-white text-gray-900'
                                                }`}
                                                value={newData.title}
                                                onChange={(e) => setNewData({ ...newData, title: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDark ? 'text-gray-300' : 'text-gray-800'
                                            }`}>Location</label>
                                            <input
                                                type="text"
                                                className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition ${
                                                    isDark 
                                                        ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                        : 'border-green-300 bg-white text-gray-900'
                                                }`}
                                                value={newData.location}
                                                onChange={(e) => setNewData({ ...newData, location: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDark ? 'text-gray-200' : 'text-gray-800'
                                            }`}>Description</label>
                                            <textarea
                                                className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition resize-none ${
                                                    isDark 
                                                        ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                        : 'border-green-300 bg-white text-gray-900'
                                                }`}
                                                value={newData.description}
                                                onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                                                required
                                                rows={3}
                                                autoComplete="off"
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
                                            value={newData.speaker}
                                            onChange={(e) => setNewData({ ...newData, speaker: e.target.value })}
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
                                                isDark ? 'text-gray-300' : 'text-green-600'
                                            }`}>Start Date</label>
                                            <input
                                                type="date"
                                                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition text-sm ${
                                                    validationErrors.start_date
                                                        ? 'border-red-500 focus:ring-red-400'
                                                        : isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100 focus:ring-green-400' 
                                                            : 'border-green-300 bg-white text-gray-900 focus:ring-green-400'
                                                }`}
                                                value={newData.start_date || ''}
                                                min={newData.registration_deadline || undefined}
                                                onChange={(e) => setNewData({ ...newData, start_date: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                            {validationErrors.start_date && (
                                                <p className="mt-1 text-xs text-red-500">{validationErrors.start_date}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${
                                                isDark ? 'text-gray-300' : 'text-green-600'
                                            }`}>End Date</label>
                                            <input
                                                type="date"
                                                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition text-sm ${
                                                    validationErrors.end_date
                                                        ? 'border-red-500 focus:ring-red-400'
                                                        : isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100 focus:ring-green-400' 
                                                            : 'border-green-300 bg-white text-gray-900 focus:ring-green-400'
                                                }`}
                                                value={newData.end_date || ''}
                                                min={newData.start_date || undefined}
                                                onChange={(e) => setNewData({ ...newData, end_date: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                            {validationErrors.end_date && (
                                                <p className="mt-1 text-xs text-red-500">{validationErrors.end_date}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${
                                                isDark ? 'text-gray-300' : 'text-green-600'
                                            }`}>Start Time</label>
                                            <input
                                                type="time"
                                                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition text-sm ${
                                                    validationErrors.start_time
                                                        ? 'border-red-500 focus:ring-red-400'
                                                        : isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100 focus:ring-green-400' 
                                                            : 'border-green-300 bg-white text-gray-900 focus:ring-green-400'
                                                }`}
                                                value={newData.start_time}
                                                onChange={(e) => setNewData({ ...newData, start_time: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                            {validationErrors.start_time && (
                                                <p className="mt-1 text-xs text-red-500">{validationErrors.start_time}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${
                                                isDark ? 'text-gray-300' : 'text-green-600'
                                            }`}>End Time</label>
                                            <input
                                                type="time"
                                                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition text-sm ${
                                                    validationErrors.end_time
                                                        ? 'border-red-500 focus:ring-red-400'
                                                        : isDark 
                                                            ? 'border-gray-600 bg-gray-800 text-gray-100 focus:ring-green-400' 
                                                            : 'border-green-300 bg-white text-gray-900 focus:ring-green-400'
                                                }`}
                                                value={newData.end_time}
                                                onChange={(e) => setNewData({ ...newData, end_time: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                            {validationErrors.end_time && (
                                                <p className="mt-1 text-xs text-red-500">{validationErrors.end_time}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${
                                            isDark ? 'text-gray-300' : 'text-green-700'
                                        }`}>Registration Deadline</label>
                                        <input
                                            type="date"
                                            className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition ${
                                                validationErrors.registration_deadline
                                                    ? 'border-red-500 focus:ring-red-400'
                                                    : isDark 
                                                        ? 'border-gray-600 bg-gray-800 text-gray-100 focus:ring-green-400' 
                                                        : 'border-green-300 bg-white text-gray-900 focus:ring-green-400'
                                            }`}
                                            value={newData.registration_deadline || ''}
                                            max={newData.start_date ? new Date(new Date(newData.start_date).getTime() - 86400000).toISOString().split('T')[0] : undefined}
                                            onChange={(e) => setNewData({ ...newData, registration_deadline: e.target.value })}
                                            required
                                            autoComplete="off"
                                        />
                                        {validationErrors.registration_deadline && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {validationErrors.registration_deadline}
                                            </p>
                                        )}
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
                                isDark ? 'text-gray-100' : 'text-gray-800'
                            }`}>Seminar Image</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${
                                    isDark ? 'text-gray-300' : 'text-gray-800'
                                }`}>Upload Image <span className="text-gray-500 text-xs">(optional)</span></label>
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
                                    src={image}
                                    alt="Seminar"
                                    className={`w-full max-w-[250px] h-auto object-cover rounded-xl border shadow-sm cursor-pointer transition-opacity hover:opacity-90 ${
                                        isDark 
                                            ? 'bg-gray-700 border-gray-600' 
                                            : 'bg-white border-gray-300'
                                    }`}
                                    onClick={() => setShowImagePreview(true)}
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
                        onClick={() => toggleOff()}
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
                        disabled={Object.keys(validationErrors).length > 0}
                        className={`px-6 py-2.5 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 shadow-sm ${
                            Object.keys(validationErrors).length > 0
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-400'
                        }`}
                        title={Object.keys(validationErrors).length > 0 ? 'Please fix all validation errors' : 'Update seminar'}
                    >
                        Update Seminar
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
                        src={image}
                        alt="Seminar Image Preview"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                </div>
            </div>
        )}
        </>
    );
}