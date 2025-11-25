import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce a value
 * Delays updating the returned value until after the specified delay
 * Useful for search inputs to reduce API calls
 * 
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {*} The debounced value
 */
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clear the timeout if value changes (cleanup function)
        // This prevents the debounced value from updating if value changes again
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
