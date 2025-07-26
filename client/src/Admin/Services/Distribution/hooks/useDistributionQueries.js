import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// =================================================================
// DISTRIBUTION STACKS QUERY
// =================================================================

export const useDistributionStacks = () => {
    return useQuery({
        queryKey: ['distributionStacks'],
        queryFn: async () => {
            const response = await fetch('/api/dist/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch distribution stacks: ${response.status}`
                );
            }

            const result = await response.json();
            return result || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });
};

// =================================================================
// DISTRIBUTION REQUESTS QUERY
// =================================================================

export const useDistributionRequests = () => {
    return useQuery({
        queryKey: ['distributionRequests'],
        queryFn: async () => {
            const response = await fetch('/api/dist/request/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch distribution requests: ${response.status}`
                );
            }

            const result = await response.json();
            return result.requests || [];
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        cacheTime: 5 * 60 * 1000, // 5 minutes
    });
};

// =================================================================
// ALL ITEMS QUERY (for dropdown in add modal)
// =================================================================

export const useAllItems = () => {
    return useQuery({
        queryKey: ['allItems'],
        queryFn: async () => {
            const response = await fetch('/api/inventory/all/items', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch all items: ${response.status}`
                );
            }

            const result = await response.json();
            return result || [];
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        cacheTime: 15 * 60 * 1000, // 15 minutes
    });
};

// =================================================================
// MUTATIONS
// =================================================================

export const useAddDistributionItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData) => {
            const response = await fetch('/api/dist/item', {
                method: 'POST',
                body: formData, // Send FormData directly for file upload
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.error ||
                        `HTTP error! status: ${response.status}`
                );
            }

            if (!responseData.success) {
                throw new Error(
                    responseData.error || 'Failed to add distribution item'
                );
            }

            return responseData;
        },
        onSuccess: () => {
            // Invalidate and refetch distribution stacks
            queryClient.invalidateQueries({ queryKey: ['distributionStacks'] });
            queryClient.invalidateQueries({ queryKey: ['allItems'] });
        },
        onError: (error) => {
            console.error('Failed to add distribution item:', error);
        },
    });
};

export const useEditDistributionItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            stackId,
            formData,
            hasNameOrDescriptionChange,
        }) => {
            const response = await fetch(`/api/dist/item/${stackId}`, {
                method: 'PUT',
                body: formData, // Send FormData directly for file upload
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.error ||
                        `HTTP error! status: ${response.status}`
                );
            }

            if (!responseData.success) {
                throw new Error(
                    responseData.error || 'Failed to update distribution item'
                );
            }

            return responseData;
        },
        onSuccess: () => {
            // Invalidate and refetch distribution stacks
            queryClient.invalidateQueries({ queryKey: ['distributionStacks'] });
            queryClient.invalidateQueries({ queryKey: ['allItems'] });
        },
        onError: (error) => {
            console.error('Failed to edit distribution item:', error);
        },
    });
};

export const useUpdateRequestStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            requestId,
            status,
            itemName,
            requestorName,
            requestQuantity,
            currentStock,
        }) => {
            const response = await fetch(`/api/dist/request/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionId: requestId,
                    status,
                }),
            });

            // Check if response is ok first
            if (!response.ok) {
                // Try to parse error response, but handle cases where it's not JSON
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage =
                        errorData.error || errorData.message || errorMessage;
                } catch (e) {
                    // If response is not JSON (like HTML error page), use status text
                    errorMessage = `${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const responseData = await response.json();

            if (!responseData.success) {
                throw new Error(
                    responseData.error || 'Failed to update request status'
                );
            }

            return responseData;
        },
        onSuccess: () => {
            // Invalidate and refetch both distribution stacks and requests
            queryClient.invalidateQueries({
                queryKey: ['distributionRequests'],
            });
            queryClient.invalidateQueries({ queryKey: ['distributionStacks'] });
        },
        onError: (error) => {
            console.error('Failed to update request status:', error);
        },
    });
};
