import { useState } from 'react'
import default_seminar_pic from '../../../Assets/default_seminar_pic.jpg';

export default function Add_Program({programList, setProgramList, fetchAndSetImageUrls, setShowAdd}) {

    const [newProgram, setNewProgram] = useState({
        title: '',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        openTime: '',
        closeTime: '',
        maxParticipants: '',
        speaker: '',
        registrationDeadline: '',
        photo: '',
    });

    const handleAddProgram = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/seminars/addSeminar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newProgram.title,
                    description: newProgram.description,
                    location: newProgram.location,
                    start_date: newProgram.startDate,
                    end_date: newProgram.endDate,
                    start_time: newProgram.openTime,
                    end_time: newProgram.closeTime,
                    capacity: newProgram.capacity,
                    speaker: newProgram.speaker,
                    registration_deadline: newProgram.registrationDeadline,
                }),
            });
            const data = await response.json();

            // Create Body
            const formData = new FormData();
            // If newImage is a base64 string, convert it to a Blob
            let imageFile;
            if (
                typeof newImage === 'string' &&
                newImage.startsWith('data:image')
            ){
                const response = await fetch(newImage);
                const blob = await response.blob();
                imageFile = new File([blob], 'image.png', { type: blob.type }); // You can adjust the filename and type
            } 
            else {
                imageFile = newImage; // Use the File object directly if it's already a File
            }
            formData.append('image', imageFile);
            formData.append('id', data.payload.id);
            const setImage = await fetch('/api/seminars/setPhoto', {
                method: 'POST',
                body: formData,
            });

            // If Fails
            if (!setImage.ok) {
                const data = await setImage.json();
                console.log(data.payload.error);
                alert('Failed to upload image');
                return;
            }

            if (response.ok) {
                // Program added successfully, update the program list
                const updatedList = await fetchAndSetImageUrls([
                    data.payload,
                    ...programList,
                ]);
                setProgramList(updatedList);
                setShowAdd(false); // Close the modal
                setNewProgram({
                    title: '',
                    description: '',
                    location: '',
                    start_date: '',
                    end_date: '',
                    start_time: '',
                    end_time: '',
                    capacity: '',
                    speaker: '',
                    registrationDeadline: '',
                    photo: '',
                });

                return;
            }

            // Handle error response
            console.error('Failed to add program:', data.payload.Error);
            alert('All Parameters Required');
            
        } catch (error) {
            console.error('Error adding program:', error);
        }
    };

    // upload image
    const [newImage, setNewImage] = useState(default_seminar_pic);

    const changeImage = (event) => {
        event.preventDefault();

        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(reader.result);
            };
            reader.readAsDataURL(file);

            setNewImage(file);
        } else {
            // Revert to default if no file selected
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
                {/* Header */}
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
                {/* Content */}
                <div className="flex flex-col md:flex-row gap-10 px-8 py-8 overflow-y-auto">
                    {/* Left: Form Fields */}
                    <div className="flex-1 flex flex-col gap-5">
                        {/* Status (optional for Add, remove if not needed) */}
                        {/* <div>
                            <label className="block text-xs font-semibold text-blue-600 mb-1">
                                Status
                            </label>
                            <select
                                onChange={(e) =>
                                    setNewProgram({
                                        ...newProgram,
                                        status: e.target.value,
                                    })
                                }
                                className="w-full border border-blue-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
                                value={newProgram.status || "Upcoming"}
                            >
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Upcoming">Upcoming</option>
                            </select>
                        </div> */}
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
                                src={
                                    typeof newImage === "string"
                                        ? newImage
                                        : URL.createObjectURL(newImage)
                                }
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
