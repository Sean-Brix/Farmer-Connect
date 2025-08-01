import React, { useEffect, useRef, useState } from 'react';
import default_picture from '../../../Assets/default_seminar_pic.jpg';

export default function Edit_Seminar({ data, toggleOff, setProgramList }) {
    // Render editing data
    const [newData, setNewData] = useState(data);
    const [image, setImage] = useState(data.photo);
    const [newImage, setNewImage] = useState(null);
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-2 sm:px-4">
            <form
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[98vh] relative border border-blue-100 flex flex-col"
                onSubmit={saveSeminar}
                style={{ minWidth: 0 }}
                autoComplete="off"
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-blue-100 px-8 py-6 bg-gradient-to-r from-blue-600/10 to-blue-100 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-blue-700 tracking-tight">Edit Seminar</h2>
                    <button
                        type="button"
                        className="text-blue-400 hover:text-blue-700 text-3xl leading-none transition"
                        onClick={() => toggleOff()}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                {/* Content */}
                <div className="flex flex-col md:flex-row gap-0 md:gap-0 px-0 py-0 overflow-y-auto">
                    {/* Left: Form Fields */}
                    <div className="flex-1 flex flex-col gap-8 px-6 py-8">
                        <div className="space-y-6">
                            {/* Grouped fields, stack vertically on mobile, 2 columns on md+ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-blue-700 mb-2">Status</label>
                                    <select
                                        onChange={(e) => setNewData({ ...newData, status: e.target.value })}
                                        className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm appearance-none"
                                        value={newData.status}
                                        autoComplete="off"
                                    >
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Upcoming">Upcoming</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-blue-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
                                        value={newData.title}
                                        onChange={(e) => setNewData({ ...newData, title: e.target.value })}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-blue-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
                                        value={newData.location}
                                        onChange={(e) => setNewData({ ...newData, location: e.target.value })}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-blue-700 mb-2">Maximum Participants</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
                                        value={newData.capacity}
                                        onChange={(e) => setNewData({ ...newData, capacity: e.target.value })}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-blue-700 mb-2">Speaker Name</label>
                                    <input
                                        type="text"
                                        className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
                                        value={newData.speaker}
                                        onChange={(e) => setNewData({ ...newData, speaker: e.target.value })}
                                        required
                                        placeholder="Enter speaker name"
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-blue-700 mb-2">Registration Deadline</label>
                                    <input
                                        type="date"
                                        className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
                                        value={newData.registration_deadline}
                                        onChange={(e) => setNewData({ ...newData, registration_deadline: e.target.value })}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            {/* Dates and times in a row, stack on mobile */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-blue-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
                                        value={newData.start_date}
                                        onChange={(e) => setNewData({ ...newData, start_date: e.target.value })}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-blue-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
                                        value={newData.end_date}
                                        onChange={(e) => setNewData({ ...newData, end_date: e.target.value })}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-blue-700 mb-2">Opening Time</label>
                                    <input
                                        type="time"
                                        className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
                                        value={newData.start_time}
                                        onChange={(e) => setNewData({ ...newData, start_time: e.target.value })}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-blue-700 mb-2">Closing Time</label>
                                    <input
                                        type="time"
                                        className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
                                        value={newData.end_time}
                                        onChange={(e) => setNewData({ ...newData, end_time: e.target.value })}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-blue-700 mb-2">Description</label>
                                <textarea
                                    className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm resize-none"
                                    value={newData.description}
                                    onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                                    required
                                    rows={3}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Right: Image Upload */}
                    <div className="flex flex-col items-center gap-6 w-full md:w-80 px-6 py-8 bg-blue-50/40 border-l border-blue-100 rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl mt-0 md:mt-0">
                        <div className="w-full">
                            <label className="block text-sm font-semibold text-blue-700 mb-2">Upload Image <span className="text-blue-400 font-normal">(optional)</span></label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
                                onChange={changeImage}
                            />
                        </div>
                        <div className="w-full flex justify-center">
                            <img
                                src={image}
                                alt="Seminar"
                                className="w-full max-w-[220px] max-h-[220px] bg-white object-cover mt-2 rounded-xl border border-blue-200 shadow"
                            />
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <div className="px-8 py-6 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-b-2xl flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 px-8 transition-colors shadow focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
