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
            
            console.log('📦 Raw API Response (first item):', eicItems[0]);
            
            // Transform the data to match the expected structure
            const transformedItems = eicItems.map((stack) => {
                const transformed = {
                    id: stack.itemId,
                    stackId: stack.id,
                    Name: stack.item.name,
                    category: stack.item.category,
                    description: stack.item.description,
                    status: stack.status,
                    img: stack.item.picture || null,
                    // Include all original item properties
                    ...stack.item,
                    // Override with stack-specific data (must be after ...stack.item to override)
                    quantity: stack.quantity, // Actual available quantity from ItemStack
                    availableQuantity: stack.quantity,
                    max_quantity_per_request: stack.max_quantity_per_request, // Restriction from stack
                    date_limit: stack.date_limit, // Date limit from stack
                };
                
                return transformed;
            });
            
            console.log('🔄 Transformed Items (first item):', transformedItems[0]);
            console.log('✅ max_quantity_per_request values:', transformedItems.map(item => ({
                name: item.Name,
                max_qty: item.max_quantity_per_request,
                available_qty: item.quantity
            })));
            
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
        refetchInterval: 30 * 1000, // Refetch every 30 seconds to keep active request badges updated
        refetchIntervalInBackground: false, // Don't refetch when tab is not active
        retry: (failureCount, error) => {
            // Don't retry on auth errors
            if (error.message === 'UNAUTHORIZED') return false;
            return failureCount < 3;
        },
        enabled: true, // Fetch automatically to enable active request checking
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
                
                // Try to get error details from response
                try {
                    const errorData = await response.json();
                    console.error('❌ [EIC Request Error]:', errorData);
                    
                    // Throw the backend error message for user-friendly display
                    if (errorData.message) {
                        throw new Error(errorData.message);
                    }
                    throw new Error(`Failed to submit request: ${response.status}`);
                } catch (parseError) {
                    // If JSON parsing fails, throw generic error
                    if (parseError.message && !parseError.message.includes('JSON')) {
                        throw parseError;
                    }
                    throw new Error(`Failed to submit request: ${response.status}`);
                }
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
