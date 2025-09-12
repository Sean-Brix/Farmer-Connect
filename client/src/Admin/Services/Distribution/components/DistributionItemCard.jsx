import React from 'react';
import default_image from '../../../../Assets/eic_default.png';

export default function DistributionItemCard({
    stack,
    onViewDetails,
    onEdit,
    imageUpdateTimestamp,
    isDark,
}) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const truncatedDescription =
        stack.item?.description && stack.item.description.length > 100
            ? stack.item.description.slice(0, 100) + '...'
            : stack.item?.description;

    return (
        <div className={`relative flex flex-col border rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden group ${
            isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
        }`}>
            <div className="relative">
                <img
                    src={
                        stack.item?.id
                            ? `/api/dist/photo/${stack.item.id}?t=${imageUpdateTimestamp}`
                            : default_image
                    }
                    alt={stack.item?.name || 'Distribution Item'}
                    className="w-full h-40 sm:h-48 object-cover transition-all duration-300 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = default_image;
                    }}
                />
                <span className="absolute top-3 right-3 px-3 py-0.5 rounded-full text-xs font-semibold shadow-sm bg-green-50 text-green-700 border border-green-100">
                    Distribution
                </span>
            </div>
            <div className="flex-1 flex flex-col p-5">
                <h3 className={`text-lg font-semibold mb-1 truncate ${
                    isDark ? 'text-white' : 'text-gray-800'
                }`}>
                    {stack.item?.name || 'Unknown Item'}
                </h3>
                <p className={`text-sm mb-2 flex-1 cursor-default line-clamp-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    {truncatedDescription || 'No description available'}
                </p>
                <div className={`flex flex-wrap gap-x-3 gap-y-1 text-xs mb-3 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    <span>
                        <span className={`font-medium ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            Quantity:
                        </span>{' '}
                        {stack.quantity}
                    </span>
                    <span>
                        <span className={`font-medium ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            Category:
                        </span>{' '}
                        {stack.item?.category?.replace('_', ' ') || 'N/A'}
                    </span>
                    <span>
                        <span className={`font-medium ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            Date Added:
                        </span>{' '}
                        {formatDate(stack.createdAt)}
                    </span>
                </div>
                <div className="flex flex-col gap-2 mt-auto md:flex-row">
                    <button
                        onClick={() => onViewDetails(stack)}
                        className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => onEdit(stack)}
                        className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}
