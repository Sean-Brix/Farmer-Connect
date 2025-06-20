import React, { useEffect, useState } from 'react';

// ASSETS
import default_image from '../../Assets/default_image.png';

// MODALS
import Edit_Modal from './Edit_Modal';

export default function Item_Card({ item, isSelected }) {
    const [card, setCard] = useState(item);
    const [isOpen, setIsOpen] = useState({
        state: false,
        modal: 'details',
    });

    return (
        <>
            <div
                className={`max-w-full max-h-[370px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl bg-white m-4 border transition duration-200 ${
                    isSelected
                        ? 'border-red-500 border-2'
                        : 'border-gray-100 border'
                }`}
            >

                <div className="relative">
                    {/* IMAGE */}
                    <img
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                        src={card.photo}
                        alt="Product"
                    />

                    {/* CATEGORY */}
                    <span
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                        ${
                            card.category === 'Farming Equipment'
                                ? 'bg-blue-600'
                                : card.category === 'Harvesting Tools'
                                ? 'bg-pink-600'
                                : card.category === 'Irrigation Systems'
                                ? 'bg-purple-600'
                                : card.category === 'Storage Equipment'
                                ? 'bg-yellow-600'
                                : card.category === 'Processing Equipment'
                                ? 'bg-green-600'
                                : card.category === 'Safety Gear'
                                ? 'bg-red-600'
                                : card.category === 'Pest Control'
                                ? 'bg-indigo-600'
                                : card.category === 'Livestock Equipment'
                                ? 'bg-orange-600'
                                : card.category === 'Measuring Tools'
                                ? 'bg-teal-600'
                                : card.category === 'Fisheries'
                                ? 'bg-lime-600'
                                : card.category === 'Machinery'
                                ? 'bg-cyan-600'
                                : 'bg-gray-600'
                        } text-white`}
                    >
                        {card.category}
                    </span>
                </div>

                {/* DETAILS */}
                <div className="p-4 flex flex-col h-[170px]">
                    {/* ITEM NAME */}
                    <h3 className="text-xl font-semibold mb-1 truncate">
                        {card.Name}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {card.description}
                    </p>

                    {/* FOOTER */}
                    <div className="flex items-center justify-between mt-auto">
                        {/* STATUS */}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span
                                className={`inline-block w-2 h-2 rounded-full mr-1
                                    ${
                                        card.status === 'Available'
                                            ? 'bg-green-500'
                                            : card.status === 'Returned'
                                            ? 'bg-blue-500'
                                            : card.status === 'Reserved'
                                            ? 'bg-yellow-400'
                                            : card.status === 'Borrowed'
                                            ? 'bg-red-500'
                                            : 'bg-gray-400'
                                    }`}
                            ></span>
                            {card.status}
                        </span>

                        {/* CONTROLS */}
                        <div className="flex gap-2">
                            <button
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-3 rounded-lg text-xs border border-gray-200 transition-colors"
                                onClick={() =>
                                    setIsOpen({ state: true, modal: 'details' })
                                }
                            >
                                Details
                            </button>
                            <button
                                onClick={() =>
                                    setIsOpen({ state: true, modal: 'edit' })
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-lg text-xs transition-colors"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>

                {/* MODAL */}
                <Edit_Modal
                    isOpen={isOpen}
                    card={card}
                    setCard={setCard}
                    onClose={() =>
                        setIsOpen({ state: false, modal: 'details' })
                    }
                />
            </div>
        </>
    );
}
