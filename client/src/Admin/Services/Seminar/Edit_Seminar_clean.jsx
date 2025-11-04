import React, { useEffect, useRef, useState, useMemo } from 'react';
import default_picture from '../../../Assets/default_seminar_pic.jpg';

export default function Edit_Seminar({ data, toggleOff, setProgramList }) {
    // Log the incoming data to see the structure
    console.log('🔍 Edit Seminar - Received data:', data);
    console.log('📅 Raw date values:', {
        start_date: data.start_date,
        end_date: data.end_date,
        registration_deadline: data.registration_deadline,
    });

    // Format dates from DateTime/ISO string to YYYY-MM-DD for date inputs
    const formatDateForInput = (dateValue) => {
        if (!dateValue) return '';
        
        // Handle ISO string dates (like "2025-11-07T00:00:00.000Z")
        if (typeof dateValue === 'string') {
            // Simply extract the date part before 'T'
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

    // Use useMemo to ensure dates are formatted only once when data changes
    const initialData = useMemo(() => {
        const formatted = {
            ...data,
            start_date: formatDateForInput(data.start_date),
            end_date: formatDateForInput(data.end_date),
            registration_deadline: formatDateForInput(data.registration_deadline),
        };
        
        console.log('✨ Formatted dates:', {
            start_date: formatted.start_date,
            end_date: formatted.end_date,
            registration_deadline: formatted.registration_deadline,
        });
        
        return formatted;
    }, [data]);

    // Render editing data
    const [newData, setNewData] = useState(initialData);
    const [image, setImage] = useState(data.photo);
    const [newImage, setNewImage] = useState(null);
    const changedImage = useRef(false);

    // Update newData when initialData changes (when a different seminar is selected)
    useEffect(() => {
        console.log('🔄 Updating newData with initialData:', initialData);
        setNewData(initialData);
    }, [initialData]);

    // Save the record
    const saveSeminar = async (e) => {
        e.preventDefault();

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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-2 sm:px-4">
            <form
                className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] relative border border-gray-200 flex flex-col overflow-hidden"
                onSubmit={saveSeminar}
                style={{ minWidth: 0 }}
                autoComplete="off"
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-green-200 px-6 py-4 bg-green-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-600 rounded-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-green-800">Edit Seminar</h2>
                    </div>
                    <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => toggleOff()}
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* DEBUG INFO - Remove after fixing */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700 font-mono">
                                <strong>DEBUG:</strong> start_date="{newData.start_date}" | end_date="{newData.end_date}" | reg_deadline="{newData.registration_deadline}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col lg:flex-row gap-0 overflow-y-auto flex-1">
                    {/* Left: Form Fields */}
                    <div className="flex-1 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="lg:col-span-2">
                                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-1.5 bg-green-600 rounded-lg">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-green-800">Basic Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-green-700 mb-2">Status</label>
                                            <select
                                                onChange={(e) => setNewData({ ...newData, status: e.target.value })}
                                                className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition"
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
                                            <label className="block text-sm font-medium text-green-700 mb-2">Maximum Participants</label>
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition"
                                                value={newData.capacity}
                                                onChange={(e) => setNewData({ ...newData, capacity: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-green-700 mb-2">Title</label>
                                            <input
                                                type="text"
                                                className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition"
                                                value={newData.title}
                                                onChange={(e) => setNewData({ ...newData, title: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-green-700 mb-2">Description</label>
                                            <textarea
                                                className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition resize-none"
                                                value={newData.description}
                                                onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                                                required
                                                rows={3}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location & Speaker */}
                            <div>
                                <div className="bg-green-50 rounded-xl p-6 border border-green-200 h-full">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-1.5 bg-green-600 rounded-lg">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-green-800">Venue & Speaker</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-green-700 mb-2">Location</label>
                                            <input
                                                type="text"
                                                className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition"
                                                value={newData.location}
                                                onChange={(e) => setNewData({ ...newData, location: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-green-700 mb-2">Speaker Name</label>
                                            <input
                                                type="text"
                                                className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition"
                                                value={newData.speaker}
                                                onChange={(e) => setNewData({ ...newData, speaker: e.target.value })}
                                                required
                                                placeholder="Enter speaker name"
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule */}
                            <div>
                                <div className="bg-green-50 rounded-xl p-6 border border-green-200 h-full">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-1.5 bg-green-600 rounded-lg">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-green-800">Schedule</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-green-600 mb-1">Start Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full border border-green-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition text-sm"
                                                    value={newData.start_date || ''}
                                                    onChange={(e) => {
                                                        console.log('📅 Start date changed to:', e.target.value);
                                                        setNewData({ ...newData, start_date: e.target.value });
                                                    }}
                                                    required
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-green-600 mb-1">End Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full border border-green-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition text-sm"
                                                    value={newData.end_date || ''}
                                                    onChange={(e) => {
                                                        console.log('📅 End date changed to:', e.target.value);
                                                        setNewData({ ...newData, end_date: e.target.value });
                                                    }}
                                                    required
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-green-600 mb-1">Start Time</label>
                                                <input
                                                    type="time"
                                                    className="w-full border border-green-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition text-sm"
                                                    value={newData.start_time}
                                                    onChange={(e) => setNewData({ ...newData, start_time: e.target.value })}
                                                    required
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-green-600 mb-1">End Time</label>
                                                <input
                                                    type="time"
                                                    className="w-full border border-green-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition text-sm"
                                                    value={newData.end_time}
                                                    onChange={(e) => setNewData({ ...newData, end_time: e.target.value })}
                                                    required
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-green-700 mb-2">Registration Deadline</label>
                                            <input
                                                type="date"
                                                className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition"
                                                value={newData.registration_deadline || ''}
                                                onChange={(e) => {
                                                    console.log('📅 Registration deadline changed to:', e.target.value);
                                                    setNewData({ ...newData, registration_deadline: e.target.value });
                                                }}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Image Upload */}
                    <div className="w-full lg:w-80 bg-green-50 border-l border-green-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-green-600 rounded-lg">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-green-800">Seminar Image</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-green-700 mb-2">Upload Image <span className="text-gray-500 text-xs">(optional)</span></label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                    onChange={changeImage}
                                />
                            </div>
                            <div className="flex justify-center">
                                <img
                                    src={image}
                                    alt="Seminar"
                                    className="w-full max-w-[250px] h-auto bg-white object-cover rounded-xl border border-green-300 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-green-200 bg-green-50 px-6 py-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => toggleOff()}
                        className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
