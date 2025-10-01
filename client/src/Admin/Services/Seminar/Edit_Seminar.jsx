import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import default_picture from '../../../Assets/default_seminar_pic.jpg';

export default function Edit_Seminar({ data, toggleOff, setProgramList }) {
    const { isDark } = useTheme();
    
    // Render editing data
    const [newData, setNewData] = useState(data);
    const [image, setImage] = useState(data.photo);
    const [newImage, setNewImage] = useState(null);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const changedImage = useRef(false);

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
                                                className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition ${
                                                    isDark 
                                                        ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                        : 'border-green-300 bg-white text-gray-900'
                                                }`}
                                                value={newData.capacity}
                                                onChange={(e) => setNewData({ ...newData, capacity: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
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
                                                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition text-sm ${
                                                    isDark 
                                                        ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                        : 'border-green-300 bg-white text-gray-900'
                                                }`}
                                                value={newData.start_date}
                                                onChange={(e) => setNewData({ ...newData, start_date: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${
                                                isDark ? 'text-gray-300' : 'text-green-600'
                                            }`}>End Date</label>
                                            <input
                                                type="date"
                                                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition text-sm ${
                                                    isDark 
                                                        ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                        : 'border-green-300 bg-white text-gray-900'
                                                }`}
                                                value={newData.end_date}
                                                onChange={(e) => setNewData({ ...newData, end_date: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${
                                                isDark ? 'text-gray-300' : 'text-green-600'
                                            }`}>Start Time</label>
                                            <input
                                                type="time"
                                                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition text-sm ${
                                                    isDark 
                                                        ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                        : 'border-green-300 bg-white text-gray-900'
                                                }`}
                                                value={newData.start_time}
                                                onChange={(e) => setNewData({ ...newData, start_time: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${
                                                isDark ? 'text-gray-300' : 'text-green-600'
                                            }`}>End Time</label>
                                            <input
                                                type="time"
                                                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition text-sm ${
                                                    isDark 
                                                        ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                        : 'border-green-300 bg-white text-gray-900'
                                                }`}
                                                value={newData.end_time}
                                                onChange={(e) => setNewData({ ...newData, end_time: e.target.value })}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${
                                            isDark ? 'text-gray-300' : 'text-green-700'
                                        }`}>Registration Deadline</label>
                                        <input
                                            type="date"
                                            className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition ${
                                                isDark 
                                                    ? 'border-gray-600 bg-gray-800 text-gray-100' 
                                                    : 'border-green-300 bg-white text-gray-900'
                                            }`}
                                            value={newData.registration_deadline}
                                            onChange={(e) => setNewData({ ...newData, registration_deadline: e.target.value })}
                                            required
                                            autoComplete="off"
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
                        className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
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