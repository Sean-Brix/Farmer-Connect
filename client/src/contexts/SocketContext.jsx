import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../utils/socket.js';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Socket event listeners
        const handleConnect = () => {
            console.info('[socket] connected', { id: socket.id, ts: new Date().toISOString() });
            setIsConnected(true);
        };

        const handleDisconnect = () => {
            console.warn('[socket] disconnected', { ts: new Date().toISOString() });
            setIsConnected(false);
        };

        const handleConnectError = (error) => {
            console.error('[socket] connect_error', {
                message: error?.message,
                description: error?.description,
                stack: error?.stack,
                ts: new Date().toISOString()
            });
            setIsConnected(false);
        };

        // Add event listeners
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);

        // Cleanup function
        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('connect_error', handleConnectError);
        };
    }, []);

    const connectSocket = (role) => {
        try {
            socket.auth = { role: role || 'Guest' };
            console.debug('[socket] connecting', { role: socket.auth.role, url: socket.io.opts.hostname || 'current-origin' });
            socket.connect();
        } catch (error) {
            console.error('[socket] connect() threw', { message: error?.message, stack: error?.stack });
        }
    };

    const disconnectSocket = () => {
        socket.disconnect();
    };

    const value = {
        socket,
        isConnected,
        user,
        connectSocket,
        disconnectSocket
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext };
