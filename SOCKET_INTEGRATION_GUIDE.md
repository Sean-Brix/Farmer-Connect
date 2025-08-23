# Socket Integration Guide for Chat Components

## Overview

This guide explains how to integrate the completed socket inquiry system with your React chat components.

## Socket Events

### Client Events (Events emitted TO client)
- `client_inquiry:connected` - Connection confirmed
- `client_inquiry:inquiries_list` - List of user's inquiries
- `client_inquiry:created` - New inquiry created
- `client_inquiry:conversation` - Full conversation data
- `client_inquiry:message_sent` - Message sent confirmation
- `client_inquiry:new_reply` - New reply from admin
- `client_inquiry:status_updated` - Inquiry status changed
- `client_inquiry:closed` - Inquiry closed
- `client_inquiry:error` - Error occurred

### Client Actions (Events sent FROM client)
- `client_inquiry:get_inquiries` - Get user's inquiries
- `client_inquiry:new` - Create new inquiry
- `client_inquiry:send` - Send message to inquiry
- `client_inquiry:get_conversation` - Get full conversation
- `client_inquiry:close` - Close inquiry
- `client_inquiry:mark_read` - Mark inquiry as read

## Integration Steps

### 1. Update Chat.jsx Component

Replace the existing socket logic in your Chat.jsx with:

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
    initializeInquirySocket, 
    connectInquirySocket, 
    disconnectInquirySocket,
    createInquiry, 
    sendMessage, 
    getUserInquiries,
    getConversation,
    formatInquiryForUI,
    formatReplyForUI,
    removeInquirySocketListeners
} from '../../utils/inquirySocket.js';

export default function Chat() {
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Welcome to FITS-Tanza Support! 🌟', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [message, setMessage] = useState('');
    const [currentInquiry, setCurrentInquiry] = useState(null);
    const [userInquiries, setUserInquiries] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Initialize socket with callbacks
        initializeInquirySocket({
            onConnected: (data) => {
                setIsConnected(true);
                getUserInquiries(); // Load user's inquiries
            },
            onInquiryCreated: (data) => {
                setCurrentInquiry(data.inquiry);
                setUserInquiries(prev => [formatInquiryForUI(data.inquiry), ...prev]);
                
                // Add confirmation message
                const confirmMsg = {
                    from: 'bot',
                    text: `✅ Your inquiry "${data.inquiry.subject}" has been created. An admin will respond shortly.`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, confirmMsg]);
            },
            onInquiriesList: (inquiries) => {
                setUserInquiries(inquiries.map(formatInquiryForUI));
            },
            onNewReply: (data) => {
                const replyMsg = formatReplyForUI(data.reply);
                setMessages(prev => [...prev, replyMsg]);
                
                // Update inquiry in list
                setUserInquiries(prev => 
                    prev.map(inquiry => 
                        inquiry.id === data.inquiryId 
                            ? { ...inquiry, hasUnread: true, lastUpdate: new Date().toLocaleDateString() }
                            : inquiry
                    )
                );
            },
            onMessageSent: (data) => {
                // Message already added to UI, just confirm
                console.log('Message sent successfully');
            },
            onStatusUpdated: (data) => {
                // Update inquiry status in UI
                setUserInquiries(prev => 
                    prev.map(inquiry => 
                        inquiry.id === data.inquiryId 
                            ? { ...inquiry, status: data.status }
                            : inquiry
                    )
                );
            },
            onError: (error) => {
                const errorMsg = {
                    from: 'bot',
                    text: `❌ Error: ${error.message}`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, errorMsg]);
            },
            onConnectionError: (error) => {
                setIsConnected(false);
                console.error('Connection error:', error);
            }
        });

        // Connect socket
        connectInquirySocket('User');

        return () => {
            removeInquirySocketListeners();
            disconnectInquirySocket();
        };
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim() || !isConnected) return;

        const userMsg = { 
            from: 'user', 
            text: message, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setMessages(prev => [...prev, userMsg]);

        if (currentInquiry) {
            // Send to existing inquiry
            sendMessage({
                inquiryId: currentInquiry.id,
                message: message
            });
        } else {
            // Create new inquiry
            createInquiry({
                message: message,
                subject: message.length > 50 ? message.substring(0, 50) + '...' : message
            });
        }

        setMessage('');
    };

    // Rest of your component...
}
```

### 2. Update Socket Connection

Make sure your `socket.js` file has proper configuration:

```jsx
import { io } from 'socket.io-client';

const socket = io("/", {
    autoConnect: false,
    withCredentials: true,
});

function connectSocket(role) {
    socket.auth = { role };
    if (!socket.connected) {
        socket.connect();
    }
}

export { socket, connectSocket };
```

### 3. Authentication Check

Ensure users are authenticated before using chat:

```jsx
useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await fetch('/auth/is-authenticated', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (!data.check) {
                // Redirect to login
                navigate('/login');
                return;
            }
            
            // User is authenticated, proceed with socket connection
            connectInquirySocket('User');
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    };
    
    checkAuth();
}, []);
```

## Database Schema

The socket handlers work with the existing Prisma schema in `inquiry.prisma`. Key models:

- `Inquiry` - Main inquiry record
- `InquiryReply` - Individual messages/replies
- `InquiryAttachment` - File attachments (future feature)
- `FAQ` - Frequently asked questions

## Testing

1. Start the server: `npm start` (in server directory)
2. Start the client: `npm run dev` (in client directory)
3. Login with test credentials:
   - Username: `sean-user`
   - Password: `123456`
4. Open chat and send a message
5. Check server logs for socket events

## Troubleshooting

### Common Issues:

1. **"Authentication required" error**
   - Ensure user is logged in before accessing chat
   - Check that JWT token is present in cookies

2. **Socket not connecting**
   - Verify server is running on correct port
   - Check browser network tab for WebSocket connections

3. **Messages not appearing**
   - Check browser console for socket events
   - Verify socket event names match between client/server

### Debug Tools:

Add to your component for debugging:

```jsx
useEffect(() => {
    socket.onAny((eventName, ...args) => {
        console.log('Socket event:', eventName, args);
    });
}, []);
```

## File Structure

```
server/
├── Sockets/
│   ├── handlers/
│   │   ├── client/
│   │   │   └── client_inquiry.js ✅
│   │   └── admin/
│   │       └── admin_inquiry.js ✅
│   ├── middleware/
│   │   └── auth.js ✅
│   └── utils/
│       ├── socket-events.js ✅
│       └── inquiry-helpers.js ✅
└── config/
    └── socket.js ✅ (updated)

client/
└── src/
    └── utils/
        └── inquirySocket.js ✅ (new)
```

## Next Steps

1. Test the socket integration with the provided test credentials
2. Customize the UI messages and responses as needed
3. Implement the admin-side chat interface using similar patterns
4. Add file attachment support if needed
5. Add typing indicators for better UX
