import Navbar from '../../../Components/Navigation/Navbar'
import { Link } from "react-router-dom";
import me from '../Assets/me.png'

export default function Edit_prof() {
    return (
        <Navbar>
            <div className="relative mt-30">
                <hr className="border-black-300" />
                <span className="absolute left-1/8 -translate-x-1/4 -top-5 bg-white rounded-lg px-4 text-2xl font-semibold text-black-700">
                    Account Settings
                </span>
            </div>
            <div className="flex flex-col items-center min-h-screen bg-white px-2 sm:px-0 mt-20 gap-10">
                <div className="border-2 border-blue-900 rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-5xl bg-white">
                    <div className="flex items-center mb-10 mt-10">
                        <span className="bg-white rounded-lg px-4 text-2xl sm:text-2xl font-semibold text-black-700 whitespace-nowrap z-10">
                            Profile Information
                        </span>
                        <hr className="flex-1 border-black-300 ml-4" />
                    </div>
                    <div className="bg-white flex flex-col-reverse md:flex-row border-b-none justify-center shadow-lg rounded-lg overflow-hidden p-4 sm:p-8 md:p-12 w-full max-w-5xl min-h-[400px] md:min-h-[600px]">
                        <form className="mt-4 md:mt-0 space-y-8 text-black-700 p-4 sm:p-4 w-full md:w-1/2">
                            <label className="block">
                                <span className="text-black-700 font-bold">💼 Occupation</span>
                                <input type="text" className="mt-1 block w-full border rounded-lg p-2" placeholder="Enter occupation" />
                            </label>
                            <label className="block">
                                <span className="text-black-700 font-bold">📍 Address</span>
                                <input type="text" className="mt-1 block w-full border rounded-lg p-2" placeholder="Enter address" />
                            </label>
                            <label className="block">
                                <span className="text-black-700 font-bold">📞 Cellphone</span>
                                <input type="text" className="mt-1 block w-full border rounded-lg p-2" placeholder="Enter cellphone" />
                            </label>
                            <label className="block">
                                <span className="text-black-700 font-bold">🏢 Institution</span>
                                <input type="text" className="mt-1 block w-full border rounded-lg p-2" placeholder="Enter institution" />
                            </label>
                            <label className="block">
                                <span className="text-black-700 font-bold">🌾 Commodities</span>
                                <input type="text" className="mt-1 block w-full border rounded-lg p-2" placeholder="Enter commodities" />
                            </label>
                        </form>
                        <div className="flex flex-col items-center space-y-4 mb-6 md:mb-0 p-2 sm:p-4 w-full md:w-1/2 ">
                            <div className="flex items-center justify-center mb-4">
                                <div className="rounded-full border-4 border-blue-800 p-1 flex items-center justify-center">
                                    <img
                                        src={me}
                                        alt="Profile"
                                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full shadow-lg"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-2 w-full">
                                <input
                                    type="text"
                                    className="border-2 border-blue-800 rounded-lg px-4 py-1 text-lg font-semibold text-black-700 w-fit text-center"
                                    placeholder="Enter name"
                                />
                                {/* Gender dropdown */}
                                <select
                                    className="border rounded-lg  py-1 text-base text-black-600 w-fit text-center"
                                    defaultValue=""
                                >
                                    <option value="" disabled className='items-center flex justify-center'>
                                        Select gender
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>

                                {/* Position dropdown */}
                                <select
                                    className="border rounded-lg px-2 py-1 text-base text-black-600 w-fit "
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select position
                                    </option>
                                    <option value="farmer">Farmer</option>
                                    <option value="agronomist">Fisherist</option>
                                    <option value="trader">Programmer</option>
                                    <option value="extension_officer">Manager</option>
                                    <option value="researcher">P.R.O</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="text-center">
                                <div>
                                    <Link
                                        to="/profiles"
                                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-green-800 text-white rounded-lg hover:bg-green-500 transition text-sm sm:text-base border-2 border-blue-800"
                                    >
                                        <i className="fa fa-check " ></i>
                                        Save Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-2 border-blue-900 rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-5xl bg-white mt-10">
                    <div className="flex items-center mb-4">
                        <span className="bg-white rounded-lg px-4 text-2xl sm:text-2xl font-semibold text-black-700 whitespace-nowrap z-10">
                            Contacts Information
                        </span>
                        <hr className="flex-1 border-black-300 ml-4" />
                    </div>
                    <form className="flex flex-col w-full mt-4 space-y-4">
                        <label className="flex flex-row justify-between items-center py-2 border-b border-gray-200">
                            <span className="font-semibold text-black-700">Email</span>
                            <input
                                type="email"
                                className="text-black-600 border rounded-lg px-2 py-1"
                                placeholder="Enter email"
                            />
                        </label>
                        <label className="flex flex-row justify-between items-center py-2 border-b border-gray-200">
                            <span className="font-semibold text-black-700">Alternate Phone</span>
                            <input
                                type="text"
                                className="text-black-600 border rounded-lg px-2 py-1"
                                placeholder="Enter alternate phone"
                            />
                        </label>
                        <label className="flex flex-row justify-between items-center py-2">
                            <span className="font-semibold text-black-700">Facebook</span>
                            <input
                                type="text"
                                className="text-black-600 border rounded-lg px-2 py-1"
                                placeholder="Enter Facebook"
                            />
                        </label>
                    </form>
                </div>
            </div>
        </Navbar>
    );
}
