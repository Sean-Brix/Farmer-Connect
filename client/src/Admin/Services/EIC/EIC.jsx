import { useState } from 'react';

// ASSETS
import default_image from './Assets/default_image.png';

// SUB COMPONENTS
import All_Items from './Components/All_Items/All_Items.jsx';
import EIC_Request from './Components/Request/EIC_Request.jsx';

export default function EIC() {
    const [section, setSection] = useState('all');

    return (
        <>
            {/* HEADER */}
            <div className="flex items-center ml-8 mt-16 space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full shadow">
                    <img src={default_image} alt="EIC Logo" className="w-8 h-8 rounded-full object-cover" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        EIC Services
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and review all EIC-related items and requests.
                    </p>
                </div>
            </div>

            {/* HEADER SECTIONS */}
            <div className="mt-8">{Section_Buttons(section, setSection)}</div>
            
            {/* SECTION CONTAINER */}
            <div className="mt-2 bg-white rounded-lg w-full shadow-sm border border-gray-200 p-6">
                {section === 'requests' ? <EIC_Request /> : <All_Items />}
            </div>
        </>
    );
}

/* ________________________________________________________________________________________________________________________________________________ */

// SECTION CONTROL
function Section_Buttons(section, setSection) {
    return (
        <div className="w-full flex mt-[5vh] space-x-4 justify-center rounded-lg sticky top-0 z-20 bg-blue-50/70 backdrop-blur-md border-b border-blue-100 shadow py-4">
            {[
                { key: 'all', label: 'All Items' },
                { key: 'requests', label: 'Requests' },
            ].map(({ key, label }) => (
                <button
                    key={key}
                    className={`px-8 py-3 rounded-full text-lg font-semibold transition
                        ${
                            section === key
                                ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                                : 'bg-blue-200 text-blue-900 hover:bg-blue-300'
                        }
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300`}
                    onClick={() => setSection(key)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
