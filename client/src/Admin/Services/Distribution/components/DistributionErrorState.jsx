export default function DistributionErrorState({ error, retry }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-20">
            <div className="max-w-md mx-auto text-center bg-red-50 rounded-lg p-8 border border-red-200">
                {/* Error Icon */}
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                
                {/* Error Message */}
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Failed to Load Distribution Data
                </h3>
                <p className="text-red-600 text-sm mb-4">
                    {error?.message || 'An unexpected error occurred while loading distribution information.'}
                </p>
                
                {/* Error Details (if available) */}
                {error?.details && (
                    <div className="text-xs text-red-500 bg-red-100 rounded p-2 mb-4 text-left">
                        <strong>Details:</strong> {error.details}
                    </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {retry && (
                        <button
                            onClick={retry}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Try Again
                        </button>
                    )}
                    
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh Page
                    </button>
                </div>
                
                {/* Support Contact */}
                <div className="mt-6 pt-4 border-t border-red-200">
                    <p className="text-xs text-red-500">
                        If this problem persists, please contact support or try again later.
                    </p>
                </div>
            </div>
        </div>
    );
}
