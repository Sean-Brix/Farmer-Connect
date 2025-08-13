import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import default_seminar_pic from '../../../Assets/default_seminar_pic.jpg';

export default function Add_Program({
    setShowAdd,
    search,
    searchFilter,
    statusFilter,
}) {
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
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data) => {
            const response = await fetch('/api/seminar/add', {
                method: 'POST',
                body: data,
            });
            if (!response.ok) {
                const errorData = await response.json();
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
            alert(
                error.message === 'Failed to add program'
                    ? 'All Parameters Required'
                    : error.message
            );
        },
    });

    const handleAddProgram = async (e) => {
        e.preventDefault();

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
            <style>{`input:-webkit-autofill,input:-webkit-autofill:focus,input:-webkit-autofill:hover,input:-webkit-autofill:active{-webkit-box-shadow:0 0 0 1000px #fff inset!important;box-shadow:0 0 0 1000px #fff inset!important;-webkit-text-fill-color:#222!important;}`}</style>
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-2 sm:px-4">
                <form
                    className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] relative border border-green-200 flex flex-col overflow-hidden"
                    onSubmit={handleAddProgram}
                    style={{ minWidth: 320 }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-green-200 px-6 py-4 bg-green-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-green-800">Add New Seminar</h2>
                        </div>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setShowAdd(false)}
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
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
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-green-700 mb-2">Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition"
                                                    value={newProgram.title}
                                                    onChange={(e) =>
                                                        setNewProgram({
                                                            ...newProgram,
                                                            title: e.target.value,
                                                        })
                                                    }
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-green-700 mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition"
                                                    value={newProgram.location}
                                                    onChange={(e) =>
                                                        setNewProgram({
                                                            ...newProgram,
                                                            location: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-green-700 mb-2">Maximum Participants</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition"
                                                    value={newProgram.capacity}
                                                    onChange={(e) =>
                                                        setNewProgram({
                                                            ...newProgram,
                                                            capacity: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-green-700 mb-2">Description</label>
                                                <textarea
                                                    className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition resize-none"
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
                                </div>

                                {/* Speaker Information */}
                                <div>
                                    <div className="bg-green-50 rounded-xl p-6 border border-green-200 h-full">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-1.5 bg-green-600 rounded-lg">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-green-800">Speaker</h3>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-green-700 mb-2">Speaker Name</label>
                                            <input
                                                type="text"
                                                className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition"
                                                value={newProgram.speaker}
                                                onChange={(e) =>
                                                    setNewProgram({
                                                        ...newProgram,
                                                        speaker: e.target.value,
                                                    })
                                                }
                                                required
                                                placeholder="Enter speaker name"
                                            />
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
                                                    <label className="block text-xs font-medium text-green-600 mb-1">End Date</label>
                                                    <input
                                                        type="date"
                                                        className="w-full border border-green-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition text-sm"
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
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-green-600 mb-1">Start Time</label>
                                                    <input
                                                        type="time"
                                                        className="w-full border border-green-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition text-sm"
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
                                                    <label className="block text-xs font-medium text-green-600 mb-1">End Time</label>
                                                    <input
                                                        type="time"
                                                        className="w-full border border-green-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition text-sm"
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
                                                <label className="block text-sm font-medium text-green-700 mb-2">Registration Deadline</label>
                                                <input
                                                    type="date"
                                                    className="w-full border border-green-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 transition"
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
                                        src={typeof newImage === 'string' ? newImage : URL.createObjectURL(newImage)}
                                        alt="Seminar Preview"
                                        className="w-full max-w-[250px] h-auto bg-white object-cover rounded-xl border border-green-300 shadow-sm"
                                        onError={(e) => {
                                            e.target.src = default_seminar_pic;
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-green-200 bg-green-50 px-6 py-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowAdd(false)}
                            className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm disabled:opacity-50"
                        >
                            {mutation.isPending ? 'Adding...' : 'Add Seminar'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
