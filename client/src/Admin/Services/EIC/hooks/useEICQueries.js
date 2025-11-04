import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// EIC Query Keys
export const EIC_QUERY_KEYS = {
    all: ['eic'],
    stacks: () => [...EIC_QUERY_KEYS.all, 'stacks'],
    requests: () => [...EIC_QUERY_KEYS.all, 'requests'],
    allItems: () => [...EIC_QUERY_KEYS.all, 'allItems'],
    photo: (id) => [...EIC_QUERY_KEYS.all, 'photo', id],
};

// API Functions
const eicAPI = {
    // Fetch EIC stacks
    fetchStacks: async () => {
        const response = await fetch('/api/eic/all');
        if (!response.ok) {
            throw new Error('Failed to fetch EIC stacks');
        }
        const data = await response.json();
        return data || [];
    },

    // Fetch EIC requests
    fetchRequests: async () => {
        const response = await fetch('/api/eic/request/all');
        if (!response.ok) {
            throw new Error('Failed to fetch EIC requests');
        }
        const data = await response.json();
        
        console.log('📥 [EIC Requests] Received from API:', {
            total: data.requests?.length || 0,
            firstRequest: data.requests?.[0] ? {
                id: data.requests[0].id,
                itemName: data.requests[0].itemName,
                quantity: data.requests[0].quantity,
                requestQuantity: data.requests[0].requestQuantity,
                quantityType: typeof data.requests[0].quantity,
                requestQuantityType: typeof data.requests[0].requestQuantity,
                status: data.requests[0].status,
            } : null
        });
        
        return data.requests || [];
    },

    // Fetch all items (for modal)
    fetchAllItems: async () => {
        const response = await fetch('/api/inventory/all/items');
        if (!response.ok) {
            throw new Error('Failed to fetch all items');
        }
        const data = await response.json();
        return data || [];
    },

    // Add EIC item
    addEICItem: async (formData) => {
        const response = await fetch('/api/inventory/item/add', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add EIC item');
        }
        return response.json();
    },

    // Edit EIC item
    editEICItem: async ({ stackId, formData, hasNameOrDescriptionChange }) => {
        const url = hasNameOrDescriptionChange
            ? `/api/eic/item/${stackId}?updateItem=true`
            : `/api/eic/item/${stackId}`;

        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to edit EIC item');
        }
        return response.json();
    },

    // Update request status
    updateRequestStatus: async ({
        requestId,
        status,
        itemName,
        requestorName,
        requestQuantity,
        currentStock,
    }) => {
        const response = await fetch('/api/eic/request/respond', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transactionId: requestId,
                status: status,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || 'Failed to update request status'
            );
        }
        return response.json();
    },
};

// Custom Hooks
export const useEICStacks = () => {
    return useQuery({
        queryKey: EIC_QUERY_KEYS.stacks(),
        queryFn: eicAPI.fetchStacks,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useEICRequests = () => {
    return useQuery({
        queryKey: EIC_QUERY_KEYS.requests(),
        queryFn: eicAPI.fetchRequests,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useAllItems = () => {
    return useQuery({
        queryKey: EIC_QUERY_KEYS.allItems(),
        queryFn: eicAPI.fetchAllItems,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
    });
};

export const useAddEICItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eicAPI.addEICItem,
        onSuccess: () => {
            // Invalidate and refetch EIC stacks
            queryClient.invalidateQueries({
                queryKey: EIC_QUERY_KEYS.stacks(),
            });
            // Also invalidate all items in case the item was added to inventory
            queryClient.invalidateQueries({
                queryKey: EIC_QUERY_KEYS.allItems(),
            });
        },
    });
};

export const useEditEICItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eicAPI.editEICItem,
        onSuccess: () => {
            // Invalidate and refetch EIC stacks
            queryClient.invalidateQueries({
                queryKey: EIC_QUERY_KEYS.stacks(),
            });
            // Also invalidate all items in case the item details were updated
            queryClient.invalidateQueries({
                queryKey: EIC_QUERY_KEYS.allItems(),
            });
        },
    });
};

export const useUpdateRequestStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eicAPI.updateRequestStatus,
        onSuccess: () => {
            // Invalidate and refetch both requests and stacks (in case quantity changed)
            queryClient.invalidateQueries({
                queryKey: EIC_QUERY_KEYS.requests(),
            });
            queryClient.invalidateQueries({
                queryKey: EIC_QUERY_KEYS.stacks(),
            });
        },
    });
};
