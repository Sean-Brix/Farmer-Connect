import { useState } from 'react';

// Equipment card component
export default function EICEquipmentCard({ item, onRequestClick, typeIcon }) {
    return (
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-green-300 transition-all duration-300 hover:transform hover:scale-105 overflow-hidden flex flex-col h-[420px]">
            <div className="relative">
                <img
                    className="w-full h-48 object-cover"
                    src={item.img || '/src/Client/Services/EIC/Assets/default_image.jpg'}
                    alt={item.Name}
                    style={{ background: '#eff6ff' }}
                />
                <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg
                        ${
                            item.category === 'Farming Equipment'
                                ? 'bg-green-600'
                                : item.category === 'Harvesting Tools'
                                ? 'bg-green-700'
                                : item.category === 'Machinery'
                                ? 'bg-gray-700'
                                : item.category === 'Irrigation Systems'
                                ? 'bg-green-500'
                                : item.category === 'Storage Equipment'
                                ? 'bg-gray-600'
                                : item.category === 'Processing Equipment'
                                ? 'bg-gray-800'
                                : item.category === 'Safety Gear'
                                ? 'bg-green-800'
                                : item.category === 'Pest Control'
                                ? 'bg-gray-700'
                                : item.category === 'Livestock Equipment'
                                ? 'bg-green-700'
                                : item.category === 'Measuring Tools'
                                ? 'bg-gray-600'
                                : item.category === 'Fisheries'
                                ? 'bg-green-600'
                                : 'bg-gray-500'
                        }`}
                >
                    {item.category}
                </span>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-1 min-h-[28px]">
                    {item.Name}
                </h3>
                <p
                    className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px] flex-grow"
                    title={item.description}
                >
                    {item.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-700 font-semibold">
                        Qty: {item.quantity}
                    </span>
                    <div className="flex items-center gap-1">
                        {typeIcon(item.category)}
                    </div>
                </div>
                <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border-2 border-green-600 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 mt-auto"
                    onClick={() => onRequestClick(item)}
                >
                    <i className="fa-solid fa-paper-plane mr-2"></i>
                    Request Equipment
                </button>
            </div>
        </div>
    );
}
