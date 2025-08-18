export default function EICErrorState({ error, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-20">
            <div className="flex flex-col items-center space-y-6 max-w-md text-center">
                {/* Error Icon */}
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-exclamation-triangle text-red-600 text-2xl"></i>
                </div>
                
                {/* Error Message */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Oops! Something went wrong
                    </h3>
                    <p className="text-gray-600 mb-4">
                        We couldn't load the equipment information at the moment.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-700 font-medium">
                            Error: {error.message || 'Unknown error occurred'}
                        </p>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onRetry}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        <i className="fa-solid fa-refresh mr-2"></i>
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        <i className="fa-solid fa-reload mr-2"></i>
                        Refresh Page
                    </button>
                </div>
                
                {/* Help Text */}
                <p className="text-sm text-gray-500">
                    If the problem persists, please contact support or try again later.
                </p>
            </div>
        </div>
    );
}
