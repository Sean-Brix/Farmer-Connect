import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// =================================================================
// EIC EQUIPMENT QUERY
// =================================================================

export const useEICEquipment = () => {
    return useQuery({
        queryKey: ['eicEquipment'],
        queryFn: async () => {
            const response = await fetch('/api/eic/all');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const eicItems = await response.json();
            
            if (!Array.isArray(eicItems)) {
                console.warn('Response is not an array or is empty:', eicItems);
                return [];
            }
            
            // Transform the data to match the expected structure
            const transformedItems = eicItems.map((stack) => ({
                id: stack.itemId,
                stackId: stack.id,
                Name: stack.item.name,
                category: stack.item.category,
                description: stack.item.description,
                quantity: stack.quantity,
                status: stack.status,
                img: stack.item.picture || null,
                // Include all original item properties
                ...stack.item,
                // Override with stack-specific data
                availableQuantity: stack.quantity,
            }));
            
            return transformedItems;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

// =================================================================
// USER REQUESTS QUERY
// =================================================================

export const useUserRequests = () => {
    return useQuery({
        queryKey: ['userRequests'],
        queryFn: async () => {
            const response = await fetch('/api/eic/request/me');
            
            if (response.status === 401) {
                // User not authenticated
                throw new Error('UNAUTHORIZED');
            }
            
            if (!response.ok) {
                throw new Error(`Failed to fetch user requests: ${response.status}`);
            }
            
            const requestsData = await response.json();
            return Array.isArray(requestsData.requests) ? requestsData.requests : [];
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        cacheTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
            // Don't retry on auth errors
            if (error.message === 'UNAUTHORIZED') return false;
            return failureCount < 3;
        },
        enabled: false, // Only fetch when explicitly called
    });
};

// =================================================================
// MUTATIONS
// =================================================================

export const useSubmitRequest = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ selectedItem, requestData }) => {
            const response = await fetch('/api/eic/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_id: selectedItem.id,
                    pickupDate: requestData.pickupDate,
                    returnDate: requestData.returnDate || null,
                    request_note: requestData.request_note,
                    quantity: parseInt(requestData.quantity),
                }),
            });

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('ADMIN_CANNOT_BORROW');
                }
                throw new Error(`Failed to submit request: ${response.status}`);
            }

            return await response.json();
        },
        onSuccess: () => {
            // Invalidate and refetch equipment list and user requests
            queryClient.invalidateQueries({ queryKey: ['eicEquipment'] });
            queryClient.invalidateQueries({ queryKey: ['userRequests'] });
        },
    });
};

export const useCancelRequest = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ requestId }) => {
            const response = await fetch('/api/eic/request/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionId: requestId,
                    status: 'Cancelled',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to cancel request');
            }

            return await response.json();
        },
        onSuccess: () => {
            // Invalidate and refetch user requests
            queryClient.invalidateQueries({ queryKey: ['userRequests'] });
        },
    });
};
