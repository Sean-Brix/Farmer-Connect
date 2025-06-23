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
        <div
            className={`max-w-full max-h-[370px] rounded-lg overflow-hidden shadow bg-white m-4 border transition duration-200 ${
                isSelected
                    ? 'border-blue-300'
                    : 'border-gray-200'
            }`}
        >
            <div className="relative">
                {/* IMAGE */}
                <img
                    className="w-full h-44 object-cover bg-gray-100"
                    src={card.photo || default_image}
                    alt="Product"
                />

                {/* CATEGORY */}
                <span
                    className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                >
                    {card.category}
                </span>
            </div>

            {/* DETAILS */}
            <div className="p-4 flex flex-col h-[150px]">
                {/* ITEM NAME */}
                <h3 className="text-base font-semibold mb-1 truncate text-gray-800">
                    {card.Name}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                    {card.description}
                </p>

                {/* FOOTER */}
                <div className="flex items-center justify-between mt-auto">
                    {/* STATUS */}
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <span
                            className={`inline-block w-2 h-2 rounded-full mr-1 ${
                                card.status === 'Available'
                                    ? 'bg-green-400'
                                    : card.status === 'Returned'
                                    ? 'bg-blue-200'
                                    : card.status === 'Reserved'
                                    ? 'bg-yellow-200'
                                    : card.status === 'Borrowed'
                                    ? 'bg-red-200'
                                    : 'bg-gray-200'
                            }`}
                        ></span>
                        {card.status}
                    </span>

                    {/* CONTROLS */}
                    <div className="flex gap-2">
                        <button
                            className="bg-white hover:bg-gray-100 text-gray-700 font-medium py-1 px-2 rounded text-xs border border-gray-300 shadow-sm transition"
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
                            className="bg-white hover:bg-blue-50 text-blue-600 font-medium py-1 px-2 rounded text-xs border border-blue-200 shadow-sm transition"
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
    );
}
