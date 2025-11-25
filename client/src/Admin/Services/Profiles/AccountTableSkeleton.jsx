/**
 * Skeleton loader for the accounts table
 * Shows animated placeholders while data is loading
 */
export default function AccountTableSkeleton({ rows = 10, isDark = false }) {
    const bgColor = isDark ? 'bg-gray-700' : 'bg-gray-200';
    const shimmerGradient = isDark
        ? 'from-gray-700 via-gray-600 to-gray-700'
        : 'from-gray-200 via-gray-100 to-gray-200';

    return (
        <>
            {Array.from({ length: rows }).map((_, index) => (
                <tr
                    key={index}
                    className={`border-b ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}
                >
                    {/* Username column */}
                    <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                            {/* Avatar skeleton */}
                            <div
                                className={`w-10 h-10 rounded-full ${bgColor} animate-pulse relative overflow-hidden`}
                            >
                                <div
                                    className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r ${shimmerGradient}`}
                                />
                            </div>
                            {/* Username text skeleton */}
                            <div
                                className={`h-4 ${bgColor} rounded w-24 animate-pulse relative overflow-hidden`}
                            >
                                <div
                                    className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r ${shimmerGradient}`}
                                />
                            </div>
                        </div>
                    </td>

                    {/* Name column */}
                    <td className="px-5 py-4">
                        <div
                            className={`h-4 ${bgColor} rounded w-32 animate-pulse relative overflow-hidden`}
                        >
                            <div
                                className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r ${shimmerGradient}`}
                            />
                        </div>
                    </td>

                    {/* Email column */}
                    <td className="px-5 py-4">
                        <div
                            className={`h-4 ${bgColor} rounded w-40 animate-pulse relative overflow-hidden`}
                        >
                            <div
                                className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r ${shimmerGradient}`}
                            />
                        </div>
                    </td>

                    {/* Role column */}
                    <td className="px-5 py-4">
                        <div
                            className={`h-6 ${bgColor} rounded-full w-20 animate-pulse relative overflow-hidden`}
                        >
                            <div
                                className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r ${shimmerGradient}`}
                            />
                        </div>
                    </td>

                    {/* Client Profile column */}
                    <td className="px-5 py-4">
                        <div
                            className={`h-6 ${bgColor} rounded-full w-24 animate-pulse relative overflow-hidden`}
                        >
                            <div
                                className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r ${shimmerGradient}`}
                            />
                        </div>
                    </td>

                    {/* Actions column */}
                    <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                            <div
                                className={`h-8 w-8 ${bgColor} rounded animate-pulse relative overflow-hidden`}
                            >
                                <div
                                    className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r ${shimmerGradient}`}
                                />
                            </div>
                            <div
                                className={`h-8 w-8 ${bgColor} rounded animate-pulse relative overflow-hidden`}
                            >
                                <div
                                    className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r ${shimmerGradient}`}
                                />
                            </div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}
