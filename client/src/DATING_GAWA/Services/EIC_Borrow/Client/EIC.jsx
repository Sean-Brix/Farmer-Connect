import React from 'react';
import Navbar from '../../../../Components/Navigation/Navbar';
import Shovel from '../Assets/shovel.webp';
import Pandilig from '../Assets/pandilig.webp';
import '../../../index.css';

const equipmentList = [
    {
        name: 'apple',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
    {
        name: 'banana',
        desc: 'njwdwsdwdwd. ',
        img: Pandilig,
    },
    {
        name: 'cat',
        desc: 'Pang hukay ng bangkay to boss',
        img: Shovel,
    },
    {
        name: 'dog',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
    {
        name: 'Plows',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
    {
        name: 'Plows',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
    {
        name: 'Plows',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
    {
        name: 'Plows',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
];

export default function EIC() {
    const [search, setSearch] = React.useState('');

    const filteredEquipment = equipmentList.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.desc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Navbar>
                <div className="relative mt-30 ">
                    <hr className="border-black-300" />
                    <span className="absolute md:left-1/8 left-1/4 -translate-x-1/4 -top-5 family bg-white rounded-lg px-4 text-2xl font-semibold text-gray-700">
                        Available Items
                    </span>
                </div>

                {/* Searchbar */}
                <div className="flex justify-center mt-8 mb-6">
                    <div className="relative w-full max-w-md">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            {/* Search Icon (SVG) */}
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search equipment..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                        />
                    </div>
                </div>

                {/* Items  */}
                <div className="w-full mt-10 px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredEquipment.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white flex flex-col items-center min-w-0 mb-2 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 p-4 md:p-3 relative"
                                style={{ minHeight: '260px' }}
                            >
                                <div className="w-full aspect-[4/3] flex items-center justify-center mb-3 bg-gray-100 rounded">
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="object-contain w-full h-full max-h-32"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold mb-1 text-gray-800">
                                    {item.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 text-center">
                                    {item.desc}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-auto w-full justify-center">
                                    <button className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm font-medium transition-colors min-w-[90px]">
                                        Borrow
                                    </button>
                                    <button className="bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors min-w-[90px]">
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Navbar>
        </>
    );
}
