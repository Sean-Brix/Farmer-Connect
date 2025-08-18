export default function EICPagination({ 
    currentPage, 
    setCurrentPage, 
    totalPages 
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-6 mb-2">
            <nav
                className="flex items-center gap-1 bg-white rounded-lg shadow-md border-2 border-gray-200 px-3 py-1.5"
                aria-label="Pagination"
            >
                <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-gray-600 hover:bg-gray-100 hover:text-gray-800 ${
                        currentPage === 1
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                    }`}
                    aria-label="Previous"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M15 19l-7-7 7-7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                {totalPages > 6 ? (
                    <>
                        <button
                            onClick={() => setCurrentPage(1)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                currentPage === 1
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            1
                        </button>
                        {currentPage > 3 && (
                            <span className="px-1 text-gray-400">...</span>
                        )}
                        {Array.from({ length: 3 }, (_, i) => {
                            const page = currentPage - 1 + i;
                            if (page <= 1 || page >= totalPages) return null;
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                        currentPage === page
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        {currentPage < totalPages - 2 && (
                            <span className="px-1 text-gray-400">...</span>
                        )}
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                currentPage === totalPages
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {totalPages}
                        </button>
                    </>
                ) : (
                    Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                currentPage === i + 1
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))
                )}
                <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-gray-600 hover:bg-gray-100 hover:text-gray-800 ${
                        currentPage === totalPages
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                    }`}
                    aria-label="Next"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M9 5l7 7-7 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </nav>
        </div>
    );
}
