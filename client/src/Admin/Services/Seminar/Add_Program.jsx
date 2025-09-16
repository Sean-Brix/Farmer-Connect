import { useState } from 'react';
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
                    <div className={`flex justify-between items-center border-b px-6 py-4 ${
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
                    <div className="flex flex-col lg:flex-row gap-0 overflow-y-auto flex-1">
                        {/* Left: Form Fields */}
                        <div className="flex-1 p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Basic Information */}
                                <div className="lg:col-span-2">
                                    <div className={`rounded-xl p-6 border ${
                                        isDark 
                                            ? 'bg-gray-800 border-gray-600' 
                                            : 'bg-white border-gray-200'
                                    }`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-1.5 bg-green-600 rounded-lg">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className={`text-lg font-semibold ${
                                                isDark ? 'text-gray-100' : 'text-gray-800'
                                            }`}>Basic Information</h3>
                                        </div>
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
                                </div>

                                {/* Speaker Information */}
                                <div>
                                    <div className={`rounded-t-xl p-6 border h-full ${
                                        isDark 
                                            ? 'bg-gray-800 border-gray-600' 
                                            : 'bg-white border-gray-200'
                                    }`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-1.5 bg-green-600 rounded-lg">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <h3 className={`text-lg font-semibold ${
                                                isDark ? 'text-gray-100' : 'text-gray-800'
                                            }`}>Speaker</h3>
                                        </div>
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
                                </div>

                                {/* Schedule */}
                                <div>
                                    <div className={`rounded-t-xl p-6 border h-full ${
                                        isDark 
                                            ? 'bg-gray-800 border-gray-600' 
                                            : 'bg-white border-gray-200'
                                    }`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-1.5 bg-green-600 rounded-lg">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className={`text-lg font-semibold ${
                                                isDark ? 'text-gray-100' : 'text-gray-800'
                                            }`}>Schedule</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
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
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
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
                        </div>

                        {/* Right: Image Upload */}
                        <div className={`w-full lg:w-80 border-l p-6 ${
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
                            <div className="space-y-4 mb-8">
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
                                <div className="space-y-3 flex flex-col items-center">
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
                    <div className={`border-t px-6 py-4 flex justify-end gap-3 ${
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
                            disabled={mutation.isPending}
                            className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm disabled:opacity-50"
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
