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
            const response = await fetch('/api/seminar/one/add', {
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
        formData.append(
            'registration_deadline',
            newProgram.registrationDeadline
        );

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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <form
                className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-2xl max-h-[95vh] relative border border-blue-200 flex flex-col"
                onSubmit={handleAddProgram}
                style={{ minWidth: 320 }}
            >
                <div className="flex justify-between items-center border-b border-blue-100 px-8 py-5 bg-gradient-to-r from-blue-500/10 to-blue-100 rounded-t-3xl">
                    <h2 className="text-xl font-bold text-blue-700 tracking-tight">
                        Add Program
                    </h2>
                    <button
                        type="button"
                        className="text-blue-400 hover:text-blue-700 text-3xl leading-none transition"
                        onClick={() => setShowAdd(false)}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <div className="flex flex-col md:flex-row gap-10 px-8 py-8 overflow-y-auto">
                    <div className="flex-1 flex flex-col gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
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
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
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
                        <div className="flex gap-3 flex-col sm:flex-row">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-blue-600 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
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
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-blue-600 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
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
                        <div className="flex gap-3 flex-col sm:flex-row">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-blue-600 mb-1">
                                    Opening Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
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
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-blue-600 mb-1">
                                    Closing Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
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
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Maximum Participants
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
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
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Speaker Name
                            </label>
                            <input
                                type="text"
                                className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
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
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Registration Deadline
                            </label>
                            <input
                                type="date"
                                className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
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
                        <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Description
                            </label>
                            <textarea
                                className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
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
                    <div className="flex flex-col items-center gap-4 w-full md:w-64">
                        <label className="block text-xs font-semibold text-blue-600 mb-1 self-start">
                            Upload Image{' '}
                            <span className="text-blue-300">(optional)</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                            onChange={changeImage}
                        />
                        <div className="w-full flex justify-center">
                            <img
                                src={
                                    newImage instanceof File
                                        ? URL.createObjectURL(newImage)
                                        : newImage
                                }
                                alt="Seminar"
                                className="w-full max-w-[200px] max-h-[200px] bg-blue-50 object-cover mt-2 rounded-xl border border-blue-200 shadow"
                            />
                        </div>
                    </div>
                </div>
                <div className="px-8 py-5 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-b-3xl flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2 px-8 transition-colors shadow focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}
