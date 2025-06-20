import React, { useEffect, useRef, useState } from 'react';
import default_picture from '../../../Assets/default_seminar_pic.jpg';

export default function Edit_Seminar({
    data,
    toggleOff,
    setProgramList,
}) {
    // Render editing data
    const [newData, setNewData] = useState(data);
    const [image, setImage] = useState(data.photo);
    const [newImage, setNewImage] = useState(null);
    const changedImage = useRef(false);

    // Save the record
    const saveSeminar = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/seminars/updateSeminar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            if (!response.ok) {
                const data = await response.json();

                console.error(
                    'Failed to update seminar:',
                    response.status,
                    response.statusText,
                    data.payload.error
                );

                alert('Failed to update seminar. Please try again.');
                return;
            }

            if (changedImage.current) {
                // Create Body
                const formData = new FormData();
                formData.append('image', newImage);
                formData.append('id', newData.id);

                // Request Changes
                const setImage = await fetch('/api/seminars/setPhoto', {
                    method: 'POST',
                    body: formData,
                });

                changedImage.current = false;

                // If Fails
                if (!setImage.ok) {
                    const data = await response.json();
                    console.log(data.payload.error);
                    alert('Failed to upload image');
                    return;
                }
            }

            setProgramList((prev) => {
                const index = prev.findIndex(
                    (item) => item.location === newData.location
                );
                if (index !== -1) {
                    const updatedList = [...prev];
                    updatedList[index] = {...newData, photo: changedImage.current? URL.createObjectURL(newImage):image};
                    return updatedList;
                } 
                else {
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <form
                className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-2xl max-h-[95vh] relative border border-blue-200 flex flex-col"
                onSubmit={saveSeminar}
                style={{ minWidth: 320 }}
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-blue-100 px-8 py-5 bg-gradient-to-r from-blue-500/10 to-blue-100 rounded-t-3xl">
                    <h2 className="text-xl font-bold text-blue-700 tracking-tight">
                        Edit Seminar
                    </h2>
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
                <div className="flex flex-col md:flex-row gap-10 px-8 py-8 overflow-y-auto">
                    {/* Left: Form Fields */}
                    <div className="flex-1 flex flex-col gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Status
                            </label>
                            <select
                                onChange={(e) => setNewData({
                                    ...newData,
                                    status: e.target.value,
                                })}
                                className="w-full border border-blue-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
                                value={newData.status}
                            >
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Upcoming">Upcoming</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                value={newData.title}
                                onChange={(e) =>
                                    setNewData({
                                        ...newData,
                                        title: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                value={newData.location}
                                onChange={(e) =>
                                    setNewData({
                                        ...newData,
                                        location: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="flex gap-3 flex-col sm:flex-row">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-blue-600 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                    value={newData.start_date}
                                    onChange={(e) =>
                                        setNewData({
                                            ...newData,
                                            start_date: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-blue-600 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                    value={newData.end_date}
                                    onChange={(e) =>
                                        setNewData({
                                            ...newData,
                                            end_date: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 flex-col sm:flex-row">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-blue-600 mb-1">
                                    Opening Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                    value={newData.start_time}
                                    onChange={(e) =>
                                        setNewData({
                                            ...newData,
                                            start_time: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-blue-600 mb-1">
                                    Closing Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                    value={newData.end_time}
                                    onChange={(e) =>
                                        setNewData({
                                            ...newData,
                                            end_time: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Maximum Participants
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                value={newData.capacity}
                                onChange={(e) =>
                                    setNewData({
                                        ...newData,
                                        capacity: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Speaker Name
                            </label>
                            <input
                                type="text"
                                className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                value={newData.speaker}
                                onChange={(e) =>
                                    setNewData({
                                        ...newData,
                                        speaker: e.target.value,
                                    })
                                }
                                required
                                placeholder="Enter speaker name"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Registration Deadline
                            </label>
                            <input
                                type="date"
                                className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                value={newData.registration_deadline}
                                onChange={(e) =>
                                    setNewData({
                                        ...newData,
                                        registration_deadline: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Description
                            </label>
                            <textarea
                                className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
                                value={newData.description}
                                onChange={(e) =>
                                    setNewData({
                                        ...newData,
                                        description: e.target.value,
                                    })
                                }
                                required
                                rows={3}
                            />
                        </div>
                    </div>
                    {/* Right: Image Upload */}
                    <div className="flex flex-col items-center gap-4 w-full md:w-64">
                        <label className="block text-xs font-semibold text-blue-600 mb-1 self-start">
                            Upload Image <span className="text-blue-300">(optional)</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                            onChange={changeImage}
                        />
                        <div className="w-full flex justify-center">
                            <img
                                src={image}
                                alt="Seminar"
                                className="w-full max-w-[200px] max-h-[200px] bg-blue-50 object-cover mt-2 rounded-xl border border-blue-200 shadow"
                            />
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <div className="px-8 py-5 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-b-3xl flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2 px-8 transition-colors shadow focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
