import { useState } from 'react';
import Navbar from '../../../Components/Navigation/Navbar';
import '../../../index.css';

const equipmentList = [
    {
        name: 'Plows',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
    {
        name: 'Pandilig',
        desc: 'njwdwsdwdwd. ',
        img: 'pandilig-image-url',
    },
    {
        name: 'Shovel',
        desc: 'Pang hukay ng bangkay to boss',
        img: 'shovel-image-url',
    },
      {
        name: 'Shovel',
        desc: 'Pang hukay ng bangkay to boss',
        img: 'shovel-image-url',
    },
      {
        name: 'Shovel',
        desc: 'Pang hukay ng bangkay to boss',
        img: 'shovel-image-url',
    },
      {
        name: 'Shovel',
        desc: 'Pang hukay ng bangkay to boss',
        img: 'shovel-image-url',
    },
      {
        name: 'Shovel',
        desc: 'Pang hukay ng bangkay to boss',
        img: 'shovel-image-url',
    },
      {
        name: 'Shovel',
        desc: 'Pang hukay ng bangkay to boss',
        img: 'shovel-image-url',
    },
      {
        name: 'Shovel',
        desc: 'Pang hukay ng bangkay to boss',
        img: 'shovel-image-url',
    },
    
    // ...other items
];

export default function Enrollment() {
    const [search, setSearch] = useState('');

    const filteredList = equipmentList.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Navbar>
                <div className="relative mt-30">
                    <hr className="border-black-300" />
                    <span className="absolute left-1/4 md:left-1/8 -translate-x-1/4 family -top-5 bg-white rounded-lg px-4 text-2xl font-semibold text-gray-700">
                        Available Programs
                    </span>
                </div>
                {/* Search Bar */}
                <div className="flex justify-center mt-8 mb-6">
                    <div className="relative w-full max-w-md">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            {/* Search Icon (SVG) */}
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search equipment..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                        />
                    </div>
                </div>
                {/* New  Card List Layout */}
                <div className="w-full flex flex-col items-center">
                    <div className="w-full max-w-5xl flex flex-col gap-6">
                        {filteredList.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white border border-gray-200 rounded-lg flex flex-col md:flex-row items-center md:items-start p-4 transition-shadow hover:bg-gray-300 hover:shadow-lg shadow-sm mb-4 md:mb-0 w-full md:w-auto"
                            >
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="w-24 h-24 object-contain rounded mb-3 md:mb-0 md:mr-6 bg-gray-100"
                                />
                                <div className="flex-1 flex flex-col items-center md:items-start">
                                    <h3 className="text-lg font-medium text-gray-800 mb-1 text-center md:text-left">{item.name}</h3>
                                    <p className="text-gray-500 text-sm text-center md:text-left mb-4">{item.desc}</p>
                                    <div className="flex gap-2 w-full md:w-auto justify-center md:justify-start">
                                        <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm font-semibold transition-colors w-28 max-w-xs">
                                            Apply
                                        </button>
                                        <button className="bg-gray-100 text-gray-700 px-4 py-1 rounded border border-gray-300 hover:bg-gray-200 text-sm font-semibold transition-colors w-28 max-w-xs">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredList.length === 0 && (
                            <div className="text-center text-gray-400 py-10">
                                No equipment found.
                            </div>
                        )}
                    </div>
                </div>
            </Navbar>
        </>
    );
}
