/**
 * Centralized Test Configuration
 * All test files should import credentials and URLs from here
 */

export const TEST_CONFIG = {
    // Base URL
    BASE_URL: 'http://localhost:5173',
    
    // Admin Credentials
    ADMIN_EMAIL: 'admin',
    ADMIN_PASSWORD: '123456',
    
    // User Credentials
    USER_EMAIL: 'sean',
    USER_PASSWORD: '123456',
    
    // Timeouts (ms)
    DEFAULT_TIMEOUT: 10000,
    NAVIGATION_TIMEOUT: 10000,
    MODAL_TIMEOUT: 5000,
    
    // Wait times (ms)
    SHORT_WAIT: 500,
    MEDIUM_WAIT: 1000,
    LONG_WAIT: 2000,
};

// Export individual values for convenience
export const {
    BASE_URL,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    USER_EMAIL,
    USER_PASSWORD,
    DEFAULT_TIMEOUT,
    NAVIGATION_TIMEOUT,
    MODAL_TIMEOUT,
    SHORT_WAIT,
    MEDIUM_WAIT,
    LONG_WAIT,
} = TEST_CONFIG;
