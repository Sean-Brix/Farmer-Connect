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
            {/* TITLE */}
            <div className="flex items-center ml-8 mt-20 space-x-3">
                <img src={default_image} alt="EIC Logo" className="w-10 h-10 rounded-full shadow-md" />
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 text-transparent bg-clip-text tracking-tight">
                    EIC Services
                </h1>
            </div>

            {/* HEADER SECTIONS */}
            {Section_Buttons(section, setSection)}
            
            {/* SECTION CONTAINER */}
            <div className='mt-[21vh] bg-blue-300 h-100%rounded-lg w-[100%]'>

                {/* NAVIGATION */}
                {
                    section === 'requests'?
                        <EIC_Request />:
                        <All_Items />
                }

            </div>
        </>
    );
}

/* ________________________________________________________________________________________________________________________________________________ */

// SECTION CONTROL
function Section_Buttons(section, setSection) {
    return (
        <div className="flex mt-[5vh] ml-8 space-x-4 justify-center fixed z-10 ">
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
