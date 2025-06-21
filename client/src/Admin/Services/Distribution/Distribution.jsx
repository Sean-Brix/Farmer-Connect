import { useState } from 'react';
// ASSETS
import default_image from './Assets/default_image.png';

// SUB COMPONENTS
import All_Items from './All_Items/All_Items.jsx';
import Distribution_Request from './Distribution_Request.jsx';
export default function Distribution() {
    const [section, setSection] = useState('all');
    return (
        <>
            {/* TITLE */}
            <div className="flex flex-col items-start mt-8 ml-8">
                <h1 className="text-3xl font-bold text-blue-700 tracking-tight mb-2 mt-10">
                    Distribution Management
                </h1>
                <p className="text-gray-500 text-base">
                    Manage all items and distribution requests efficiently.
                </p>
            </div>
            {/* HEADER SECTIONS */}
            {Section_Buttons(section, setSection)}
            {/* SECTION CONTAINER */}
            <div className="mt-[21vh] bg-gradient-to-br from-blue-200 via-blue-100 to-white w-full shadow-lg p-6">
                {/* NAVIGATION */}
                {section === 'requests' ? (
                    <Distribution_Request />
                ) : (
                    <All_Items />
                )}
            </div>
        </>
    );
}
/* ________________________________________________________________________________________________________________________________________________ */
// SECTION CONTROL
function Section_Buttons(section, setSection) {
    return (
        <div className="flex mt-[12vh] ml-8 space-x-4 justify-center fixed z-10 ">
            {[
                { key: 'all', label: 'All Items' },
                { key: 'requests', label: 'Requests' },
            ].map(({ key, label }) => (
                <button
                    key={key}
                    className={`relative px-6 py-2 font-semibold rounded-full transition-all duration-200
                    ${
                        section === key
                            ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg scale-105'
                            : 'bg-white text-blue-600 border border-blue-400 hover:bg-blue-50'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-300`}
                    onClick={() => setSection(key)}
                >
                    {label}
                    {section === key && (
                        <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow"></span>
                    )}
                </button>
            ))}
        </div>
    );
}
