export default function DistributionLoadingState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-20">
            <div className="flex flex-col items-center space-y-4">
                {/* Animated Loading Spinner */}
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    </div>
                </div>
                
                {/* Loading Text */}
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Loading Distribution Data
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Please wait while we fetch the latest distribution information...
                    </p>
                </div>
                
                {/* Loading Dots Animation */}
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );
}
