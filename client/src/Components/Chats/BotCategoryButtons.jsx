import React from 'react';

const BotCategoryButtons = ({ categories, onCategorySelect, onEscalate }) => {
    return (
        <div className="bg-gradient-to-r from-green-50 to-green-50 border border-green-200 rounded-2xl p-4 max-w-[85%]">
            <div className="text-xs text-green-600 font-semibold mb-2">🤖 Support Bot</div>
            <div className="space-y-3">
                <div className="text-sm text-gray-700 mb-3">
                    What can I help you with today? Choose a category:
                </div>
                <div data-tutorial="category-buttons" className="grid gap-2">{categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategorySelect(category)}
                            className="text-left p-3 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-lg transition-all duration-200 group shadow-sm hover:shadow-md"
                        >
                            <div className="font-medium text-gray-900 group-hover:text-green-700">
                                {category.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 group-hover:text-green-600">
                                {category.description}
                            </div>
                        </button>
                    ))}
                </div>
                <div className="pt-2 border-t border-gray-200">
                    <button
                        onClick={onEscalate}
                        className="w-full text-center p-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                    >
                        💬 Skip to live agent instead
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BotCategoryButtons;