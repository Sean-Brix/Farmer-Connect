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
        <div className="flex justify-center space-x-4 mb-6">
            {[
                { key: 'all', label: 'All Items' },
                { key: 'requests', label: 'Requests' },
            ].map(({ key, label }) => (
                <button
                    key={key}
                    className={`px-8 py-3 rounded-lg text-lg font-semibold transition
                        ${
                            section === key
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }
                        focus:outline-none`}
                    onClick={() => setSection(key)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
