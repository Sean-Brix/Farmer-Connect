/**
 * Simple in-memory cache for Firebase download URLs
 * Caches { path -> { url, expiresAt } } to avoid repeated getDownloadURL calls
 * 
 * This cache stores Firebase Storage download URLs temporarily to reduce:
 * - API calls to Firebase
 * - Latency for frequently accessed profile pictures
 * - Cost associated with Firebase operations
 */
import { getFileUrl } from './firebase.js';

const cache = new Map();

// Default TTL in ms (1 hour - matches Firebase cache-control header)
const DEFAULT_TTL = 1000 * 60 * 60;

/**
 * Get file URL with caching
 * @param {string} path - Firebase Storage path
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Promise<string|null>} - Download URL or null
 */
export async function getFileUrlCached(path, ttl = DEFAULT_TTL) {
  if (!path) return null;

  const entry = cache.get(path);
  const now = Date.now();
  
  // Return cached URL if still valid
  if (entry && entry.expiresAt > now) {
    return entry.url;
  }

  // Fetch fresh URL and cache it
  try {
    const url = await getFileUrl(path);
    if (url) {
      cache.set(path, { url, expiresAt: now + ttl });
    }
    return url;
  } catch (error) {
    console.error(`Failed to get cached URL for ${path}:`, error);
    return null;
  }
}

/**
 * Clear cache for a specific file path
 * @param {string} path - Firebase Storage path
 */
export function clearFileCache(path) {
  if (path) {
    cache.delete(path);
  }
}

/**
 * Clear all cached URLs
 */
export function clearAllCache() {
  cache.clear();
}

/**
 * Get current cache size
 * @returns {number} - Number of cached entries
 */
export function getCacheSize() {
  return cache.size;
}

/**
 * Clean up expired cache entries
 * Call this periodically to prevent memory leaks
 */
export function cleanupExpiredCache() {
  const now = Date.now();
  let removed = 0;
  
  for (const [path, entry] of cache.entries()) {
    if (entry.expiresAt <= now) {
      cache.delete(path);
      removed++;
    }
  }
  
  if (removed > 0) {
    console.log(`Cleaned up ${removed} expired cache entries`);
  }
  
  return removed;
}

// Automatically clean up expired entries every 10 minutes
setInterval(cleanupExpiredCache, 10 * 60 * 1000);

export default {
  getFileUrlCached,
  clearFileCache,
  clearAllCache,
  getCacheSize,
  cleanupExpiredCache
};
