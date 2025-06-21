import React from 'react'
import Navbar from '../../Components/Navbar'


export default function Account() {
  const [photo, setPhoto] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    // Delete logic here
    alert("Account deleted!");
  };

  // Add confirmPassword to state
  const [profile, setProfile] = React.useState({
    name: "Rhen Devs",
    username: "rhen_devs",
    email: "rhen@example.com",
    phone: "",
    language: "English",
    notifications: { email: true, sms: false },
    address: {
      street: "",
      city: "",
      province: "",
      zip: "",
    },
    password: "",
    confirmPassword: "",
    twoFactor: false,
    theme: "light",
    privacy: {
      privateProfile: false,
      hideStatus: false,
      allowIndex: true,
    },
    connected: {
      google: false,
      twitter: true,
      facebook: false,
    },
  });

  // Error state for password confirmation
  const [passwordError, setPasswordError] = React.useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["street", "city", "province", "zip"].includes(name)) {
      setProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else if (["privateProfile", "hideStatus", "allowIndex"].includes(name)) {
      setProfile((prev) => ({
        ...prev,
        privacy: { ...prev.privacy, [name]: type === "checkbox" ? checked : value },
      }));
    } else if (name === "password" || name === "confirmPassword") {
      setProfile((prev) => ({ ...prev, [name]: value }));
    } else if (name === "theme") {
      setProfile((prev) => ({ ...prev, theme: value }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    if (profile.password && profile.password !== profile.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    // Save logic here
    alert("Profile updated!");
  };

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center mt-30">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-blue-700 mb-8 tracking-tight drop-shadow-lg flex items-center gap-3">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          Account Profile
        </h1>
        <div className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden border border-gray-100 bg-white/90 backdrop-blur-lg">
          <div className="px-8 pt-8 flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={photo || "https://via.placeholder.com/96"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-lg"
              />
              <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 transition text-white p-2 rounded-full cursor-pointer shadow-md">
                <input type="file" className="hidden" onChange={handlePhotoChange} />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6-6M2 20h7l9-9a2.828 2.828 0 10-4-4l-9 9v7z" /></svg>
              </label>
            </div>
            <div className="text-2xl font-bold text-gray-900">{profile.name}</div>
            <div className="text-gray-500">@{profile.username}</div>
          </div>
          <form className="px-8 py-8 space-y-7" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3 py-2 rounded-lg border bg-gray-100 text-gray-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={profile.password}
                  onChange={handleInputChange}
                  placeholder="New Password"
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={profile.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
                {passwordError && (
                  <div className="text-red-600 text-sm mt-1">{passwordError}</div>
                )}
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 transition text-white rounded-lg font-semibold shadow"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 transition text-white rounded-lg font-semibold shadow"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-100">
              <div className="font-bold text-xl mb-4 flex items-center gap-2 text-red-600">
                Delete Account
              </div>
              <div className="mb-6 text-gray-700">
                Are you sure you want to delete your account? This action cannot be undone.
              </div>
              <div className="flex gap-4">
                <button
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-white"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
