// Utility functions for authentication and cache management

/**
 * Refresh authentication data after login/logout
 * This function is exposed globally by the Navbar component
 */
export const refreshAuthData = () => {
  if (window.refreshAuthData) {
    window.refreshAuthData();
  } else {
    console.warn('refreshAuthData function not available. Make sure Navbar component is mounted.');
    // Fallback to page reload if function not available
    window.location.reload();
  }
};

/**
 * Call this function after successful login to refresh auth state
 */
export const onLoginSuccess = () => {
  console.log('Login successful - refreshing auth data');
  refreshAuthData();
};

/**
 * Call this function after logout to clear auth state
 */
export const onLogoutSuccess = () => {
  console.log('Logout successful - auth data will be cleared by Navbar');
  // The Navbar handleLogout already handles cache clearing
};

/**
 * Force refresh auth data when switching between different user roles
 */
export const refreshUserRole = () => {
  console.log('Refreshing user role data');
  refreshAuthData();
};
