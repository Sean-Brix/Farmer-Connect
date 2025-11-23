import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Client-side image cache for profile pictures
 * Caches Firebase URLs by user ID to avoid redundant API calls
 */
class ImageCache {
    constructor() {
        this.cache = new Map(); // Map<userId, {url, timestamp, loadTime}>
        this.pendingRequests = new Map();
        this.defaultImage = '/default_picture.png';
    }

    /**
     * Get image URL from cache or fetch from API
     * @param {string} userId - User ID to fetch image for
     * @param {boolean} isCurrentUser - Whether this is the current user's image
     * @returns {Promise<string>} - Image URL
     */
    async getImage(userId, isCurrentUser = false) {
        if (!userId) return this.defaultImage;

        // Check cache first
        if (this.cache.has(userId)) {
            console.log('🎯 [useImageCache] Cache hit for user:', userId);
            return this.cache.get(userId).url;
        }

        console.log('🎯 [useImageCache] Cache miss for user:', userId);

        // Check if request is already pending
        if (this.pendingRequests.has(userId)) {
            console.log('🎯 [useImageCache] Request already pending for user:', userId);
            const cachedData = await this.pendingRequests.get(userId);
            return cachedData.url;
        }

        // Fetch from API
        const endpoint = isCurrentUser 
            ? '/api/account/picture/me'
            : `/api/account/picture/${userId}`;

        console.log('🎯 [useImageCache] Fetching from endpoint:', endpoint);
        const startTime = Date.now();

        const promise = axios.get(endpoint, {
            params: { format: 'json' },
            withCredentials: true,
        })
        .then(response => {
            const loadTime = Date.now() - startTime;
            const url = response.data?.url || this.defaultImage;
            console.log('🎯 [useImageCache] ✓ Fetch successful for user:', userId);
            console.log('🎯 [useImageCache] URL received:', url);
            console.log('🎯 [useImageCache] Load time:', loadTime + 'ms');
            const cacheEntry = {
                url,
                timestamp: Date.now(),
                loadTime,
            };
            this.cache.set(userId, cacheEntry);
            this.pendingRequests.delete(userId);
            return cacheEntry;
        })
        .catch(error => {
            const loadTime = Date.now() - startTime;
            console.warn('🎯 [useImageCache] ✗ Fetch failed for user:', userId);
            console.warn('🎯 [useImageCache] Error:', error.response?.data?.error || error.message);
            console.warn('🎯 [useImageCache] Status:', error.response?.status);
            this.pendingRequests.delete(userId);
            // Cache default image to avoid repeated failed requests
            const cacheEntry = {
                url: this.defaultImage,
                timestamp: Date.now(),
                loadTime,
            };
            this.cache.set(userId, cacheEntry);
            return cacheEntry;
        });

        this.pendingRequests.set(userId, promise);
        const result = await promise;
        return result.url;
    }

    /**
     * Clear cache for specific user (after upload/delete)
     * @param {string} userId - User ID to clear cache for
     */
    clearUser(userId) {
        this.cache.delete(userId);
    }

    /**
     * Clear entire cache
     */
    clearAll() {
        this.cache.clear();
        this.pendingRequests.clear();
    }

    /**
     * Get cache size
     */
    size() {
        return this.cache.size;
    }
}

// Singleton instance
const imageCache = new ImageCache();

/**
 * React hook for cached profile picture loading
 * @param {string} userId - User ID to load image for
 * @param {boolean} isCurrentUser - Whether this is the current user
 * @returns {Object} - { imageUrl, isLoading, error, refresh }
 */
export function useImageCache(userId, isCurrentUser = false) {
    const [imageUrl, setImageUrl] = useState(imageCache.defaultImage);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadImage = useCallback(async () => {
        if (!userId) {
            setImageUrl(imageCache.defaultImage);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const url = await imageCache.getImage(userId, isCurrentUser);
            setImageUrl(url);
        } catch (err) {
            setError(err.message);
            setImageUrl(imageCache.defaultImage);
        } finally {
            setIsLoading(false);
        }
    }, [userId, isCurrentUser]);

    useEffect(() => {
        loadImage();
    }, [loadImage]);

    /**
     * Force refresh image (after upload/delete)
     */
    const refresh = useCallback(() => {
        imageCache.clearUser(userId);
        loadImage();
    }, [userId, loadImage]);

    return { imageUrl, isLoading, error, refresh };
}

/**
 * Helper function to clear cache for a specific user
 * Use this after uploading or deleting a profile picture
 */
export function clearImageCache(userId) {
    imageCache.clearUser(userId);
}

/**
 * Helper function to clear entire image cache
 */
export function clearAllImageCache() {
    imageCache.clearAll();
}

/**
 * Get cache statistics with metadata
 */
export function getImageCacheStats() {
    const entries = Array.from(imageCache.cache.entries()).map(([userId, data]) => ({
        userId,
        url: data.url,
        timestamp: data.timestamp,
        loadTime: data.loadTime,
    }));

    return {
        size: imageCache.size(),
        entries,
    };
}

export default useImageCache;
