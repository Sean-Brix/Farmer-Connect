# Socket Logout Integration Guide

This guide explains how to implement socket disconnection when users logout from the FITS-Tanza application.

## Overview

The socket logout system ensures that when a user logs out:
1. Their authentication session is terminated
2. All their active socket connections are disconnected
3. Local storage is cleared
4. They are redirected to the login page

## Architecture

### Server-Side Components

1. **Session Manager** (`server/Sockets/utils/session-manager.js`)
   - Tracks active socket connections by user ID
   - Manages socket registration and removal
   - Provides disconnection utilities

2. **Socket Logout Service** (`server/Services/socketLogoutService.js`)
   - Handles socket disconnection on logout
   - Provides admin tools for force disconnection
   - Manages connection statistics

3. **Updated Logout Controller** (`server/Controller/Authentication/logout.js`)
   - Integrated with socket logout service
   - Disconnects sockets during logout process
   - Maintains audit logging

4. **Updated Socket Config** (`server/config/socket.js`)
   - Initializes session management
   - Registers socket connections
   - Handles disconnection events

### Client-Side Components

1. **Socket Logout Helper** (`client/src/utils/socketLogoutHelper.js`)
   - Handles logout process with socket disconnection
   - Manages server-initiated logout events
   - Provides emergency logout functionality

2. **Updated Inquiry Socket** (`client/src/utils/inquirySocket.js`)
   - Integrated with logout helper
   - Provides logout with socket function

## Implementation Guide

### 1. Server-Side Setup

The server-side components are already configured. Key points:

- Socket connections are automatically tracked when users connect
- Logout controller will disconnect sockets when users logout
- Admin actions can force disconnect users

### 2. Client-Side Integration

#### Basic Logout Implementation

```javascript
import { logoutWithSocket } from '../utils/inquirySocket.js';

// In your logout function
async function handleLogout() {
  try {
    const success = await logoutWithSocket(async () => {
      // Your logout API call
      return await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    });
    
    if (success) {
      // Redirect to login page
      window.location.href = '/login';
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}
```

#### Advanced Integration with React

```javascript
import React, { useContext } from 'react';
import { logoutWithSocket } from '../utils/inquirySocket.js';
import socketLogoutHelper from '../utils/socketLogoutHelper.js';

function LogoutButton() {
  const handleLogout = async () => {
    try {
      const success = await logoutWithSocket(async () => {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response;
      });
      
      if (success) {
        // Additional cleanup if needed
        console.log('Logout successful');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to emergency logout
      socketLogoutHelper.emergencyLogout();
    }
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
}
```

### 3. Handling Server-Initiated Logout

The client automatically handles server-initiated logout events:

```javascript
// This is handled automatically by socketLogoutHelper
// When server sends 'auth:logout' event, the client will:
// 1. Clear local storage
// 2. Clear session storage  
// 3. Redirect to login page
```

### 4. Emergency Logout

For situations where the API is unavailable:

```javascript
import socketLogoutHelper from '../utils/socketLogoutHelper.js';

// Use in error handlers or network failure scenarios
function handleNetworkError() {
  // This will immediately disconnect socket and clear local data
  socketLogoutHelper.emergencyLogout();
}
```

## Integration with Authentication Components

### Chat Components

Update your Chat components to handle logout events:

```javascript
import { useEffect } from 'react';
import { initializeInquirySocket, connectInquirySocket } from '../utils/inquirySocket.js';

function Chat() {
  useEffect(() => {
    // Initialize socket with logout handling
    initializeInquirySocket({
      onConnect: () => console.log('Connected to chat'),
      onDisconnect: () => console.log('Disconnected from chat'),
      onConnectionError: (error) => {
        console.error('Chat connection error:', error);
        // Handle reconnection or logout
      }
    });
    
    connectInquirySocket();
    
    return () => {
      // Cleanup handled automatically
    };
  }, []);
  
  // ... rest of component
}
```

### Authentication Context

```javascript
import React, { createContext, useContext, useEffect, useState } from 'react';
import socketLogoutHelper from '../utils/socketLogoutHelper.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = async () => {
    try {
      const success = await socketLogoutHelper.logoutWithSocket(async () => {
        return await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        });
      });
      
      if (success) {
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      socketLogoutHelper.emergencyLogout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Admin Features

### Force Disconnect Users

```javascript
// Server-side admin endpoint
import socketLogoutService from '../Services/socketLogoutService.js';

async function forceDisconnectUser(req, res) {
  try {
    const { userId } = req.params;
    const adminId = req.user.id;
    
    const disconnectedCount = socketLogoutService.forceDisconnectUser(
      userId, 
      adminId, 
      'admin_force_disconnect'
    );
    
    res.json({ 
      message: 'User disconnected', 
      disconnectedSockets: disconnectedCount 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to disconnect user' });
  }
}
```

### Connection Statistics

```javascript
// Get connection stats
import socketLogoutService from '../Services/socketLogoutService.js';

async function getConnectionStats(req, res) {
  try {
    const stats = socketLogoutService.getConnectionStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
}
```

## Event Flow

### Normal Logout Flow

1. User clicks logout button
2. Client calls `logoutWithSocket()`
3. Client sends logout request to server
4. Server clears authentication cookie
5. Server calls `socketLogoutService.disconnectUserOnLogout()`
6. Server sends `auth:logout` event to user's sockets
7. Server disconnects all user's sockets
8. Client receives logout confirmation
9. Client disconnects socket locally
10. Client clears local storage
11. Client redirects to login page

### Server-Initiated Logout Flow

1. Server detects logout condition (admin action, token expiry, etc.)
2. Server calls `socketLogoutService.disconnectUserOnLogout()`
3. Server sends `auth:logout` event to user's sockets
4. Client receives `auth:logout` event
5. Client automatically clears local storage
6. Client redirects to login page

## Error Handling

### Network Failures

```javascript
// The system gracefully handles network failures
try {
  await logoutWithSocket(logoutApiCall);
} catch (error) {
  // Fallback to local cleanup
  socketLogoutHelper.emergencyLogout();
}
```

### Socket Connection Issues

```javascript
// Automatic reconnection is built-in
// Max 3 reconnection attempts before giving up
```

## Testing

### Test Logout Functionality

1. Login as a user
2. Open browser developer tools
3. Click logout
4. Verify in network tab that logout API is called
5. Verify socket disconnection in console
6. Verify redirect to login page
7. Verify local storage is cleared

### Test Force Disconnect

1. Login as admin
2. Use admin panel to force disconnect a user
3. Verify user's socket is disconnected
4. Verify user is redirected to login

### Test Server-Initiated Logout

1. Manually trigger server logout event
2. Verify client receives logout signal
3. Verify automatic cleanup and redirect

## Security Considerations

1. **Token Validation**: Tokens are validated before disconnection
2. **Audit Logging**: All logout actions are logged for admin users
3. **Graceful Cleanup**: Local storage is always cleared on logout
4. **Force Disconnect**: Admins can force disconnect problematic users
5. **Session Tracking**: All connections are tracked for security monitoring

## Troubleshooting

### Common Issues

1. **Socket not disconnecting**: Check if socket is properly initialized
2. **Local storage not cleared**: Verify logout helper is called correctly
3. **Redirect not working**: Check for JavaScript errors in console
4. **Admin force disconnect failing**: Verify admin permissions and socket service initialization

### Debug Information

```javascript
// Get socket status
import socketLogoutHelper from '../utils/socketLogoutHelper.js';
console.log(socketLogoutHelper.getStatus());

// Get connection stats (admin only)
import socketLogoutService from '../Services/socketLogoutService.js';
console.log(socketLogoutService.getConnectionStats());
```

## Best Practices

1. Always use `logoutWithSocket()` instead of direct API calls
2. Implement emergency logout for error scenarios
3. Test logout functionality across different browsers
4. Monitor socket connection stats for performance insights
5. Use proper error handling for network failures
6. Clear sensitive data from local storage on logout
7. Implement proper session timeout handling
