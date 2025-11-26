/**
 * Inquiry Polling Hooks - Complete HTTP Polling Implementation
 * Replaces Socket.io with optimized React Query polling
 * 
 * Performance Features:
 * - Incremental message fetching (only new messages)
 * - Optimistic UI updates
 * - Smart caching to prevent redundant requests
 * - Configurable polling intervals
 * - Automatic cleanup
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for inquiry messages with HTTP polling
 * @param {string} inquiryId - The inquiry ID
 * @param {object} options - Configuration
 * @returns {object} Messages and functions
 */
export function useInquiryMessages(inquiryId, options = {}) {
    const {
        enabled = true,
        pollInterval = 3000,
        onNewMessage = null
    } = options;

    const queryClient = useQueryClient();
    const [lastFetchTime, setLastFetchTime] = useState(null);
    const previousMessageIds = useRef(new Set());

    // Fetch messages
    const { 
        data: messages = [], 
        isLoading, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ['inquiry-messages', inquiryId],
        queryFn: async () => {
            // Use incremental fetching if we have a timestamp
            const url = lastFetchTime
                ? `/api/inquiries/${inquiryId}/messages?since=${lastFetchTime}`
                : `/api/inquiries/${inquiryId}/messages`;
            
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) {
                if (response.status === 404) return [];
                throw new Error('Failed to fetch messages');
            }
            
            const result = await response.json();
            const newMessages = result.data || [];
            
            // Update timestamp if we got messages
            if (newMessages.length > 0) {
                const latestMessage = newMessages[newMessages.length - 1];
                setLastFetchTime(latestMessage.createdAt);
            }
            
            return newMessages;
        },
        enabled: enabled && !!inquiryId,
        refetchInterval: enabled ? pollInterval : false,
        staleTime: 1000,
        refetchOnWindowFocus: true,
        keepPreviousData: false, // Don't keep old data to avoid duplication
        select: (data) => {
            // Deduplicate messages by ID
            const seen = new Set();
            return data.filter(msg => {
                if (seen.has(msg.id)) return false;
                seen.add(msg.id);
                return true;
            });
        }
    });

    // Detect new messages and call callback
    useEffect(() => {
        if (!messages || messages.length === 0) return;

        const currentIds = new Set(messages.map(m => m.id));
        const newMessages = messages.filter(msg => !previousMessageIds.current.has(msg.id));

        if (newMessages.length > 0 && onNewMessage) {
            newMessages.forEach(msg => onNewMessage(msg));
        }

        previousMessageIds.current = currentIds;
    }, [messages, onNewMessage]);

    // Send message mutation
    const sendMessageMutation = useMutation({
        mutationFn: async ({ message, files = [] }) => {
            const formData = new FormData();
            formData.append('message', message.trim());
            
            // Add files if provided
            if (files && files.length > 0) {
                files.forEach(file => {
                    formData.append('files', file);
                });
            }
            
            const response = await fetch(`/api/inquiries/${inquiryId}/messages`, {
                method: 'POST',
                credentials: 'include',
                body: formData // Send as FormData, not JSON
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to send message');
            }

            return response.json();
        },
        onSuccess: (data) => {
            // Add new message to cache
            queryClient.setQueryData(['inquiry-messages', inquiryId], (old = []) => {
                // Check if message already exists
                if (old.some(msg => msg.id === data.data.id)) {
                    return old;
                }
                return [...old, data.data];
            });

            // Update timestamp
            setLastFetchTime(data.data.createdAt);

            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['inquiry-list'] });
            queryClient.invalidateQueries({ queryKey: ['unread-count'] });
            queryClient.invalidateQueries({ queryKey: ['user-inquiries'] });
        }
    });

    const sendMessage = useCallback(
        (message, files = []) => sendMessageMutation.mutateAsync({ message, files }),
        [sendMessageMutation]
    );

    const refreshMessages = useCallback(() => refetch(), [refetch]);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        refreshMessages,
        isSending: sendMessageMutation.isPending
    };
}

/**
 * Hook for unread message count
 */
export function useUnreadCount() {
    const { data = 0, isLoading, error } = useQuery({
        queryKey: ['unread-count'],
        queryFn: async () => {
            const response = await fetch('/api/inquiries/messages/unread-count', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch unread count');
            const result = await response.json();
            return result.data.unreadCount;
        },
        refetchInterval: 10000,
        staleTime: 5000
    });

    return { unreadCount: data, isLoading, error };
}

/**
 * Hook for user's inquiries
 */
export function useUserInquiries(options = {}) {
    const { enabled = true } = options;
    
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: ['user-inquiries'],
        queryFn: async () => {
            const response = await fetch('/api/inquiries/my-inquiries', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch inquiries');
            const result = await response.json();
            return result.data || [];
        },
        enabled,
        refetchInterval: enabled ? 5000 : false,
        staleTime: 2000
    });

    return { inquiries: data, isLoading, error, refetch };
}

/**
 * Hook for active inquiry (user)
 */
export function useActiveInquiry(options = {}) {
    const { enabled = true } = options;
    
    const { data = null, isLoading, error, refetch } = useQuery({
        queryKey: ['active-inquiry'],
        queryFn: async () => {
            const response = await fetch('/api/inquiries/active/me', {
                credentials: 'include'
            });
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error('Failed to fetch active inquiry');
            }
            const result = await response.json();
            return result.data;
        },
        enabled,
        refetchInterval: enabled ? 5000 : false,
        staleTime: 2000
    });

    return { activeInquiry: data, isLoading, error, refetch };
}

/**
 * Hook for admin inquiry list
 */
export function useAdminInquiries(status = null) {
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: ['admin-inquiries', status],
        queryFn: async () => {
            const url = status 
                ? `/api/inquiries/by-status?status=${status}`
                : '/api/inquiries/by-status';
            
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch inquiries');
            const result = await response.json();
            return result.items || [];
        },
        refetchInterval: 10000, // Poll every 10s to reduce flicker
        staleTime: 3000,
        keepPreviousData: true
    });

    return { inquiries: data, isLoading, error, refetch };
}

/**
 * Hook to resolve inquiry
 */
export function useResolveInquiry() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (inquiryId) => {
            const response = await fetch(`/api/inquiries/${inquiryId}/resolve`, {
                method: 'PATCH',
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to resolve inquiry');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inquiry-messages'] });
            queryClient.invalidateQueries({ queryKey: ['user-inquiries'] });
            queryClient.invalidateQueries({ queryKey: ['active-inquiry'] });
            queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
        }
    });
}

/**
 * Hook to create inquiry
 */
export function useCreateInquiry() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ subject, message }) => {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ subject, message })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create inquiry');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-inquiries'] });
            queryClient.invalidateQueries({ queryKey: ['active-inquiry'] });
        }
    });
}
