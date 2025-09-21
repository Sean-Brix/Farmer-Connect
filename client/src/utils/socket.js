import { io } from 'socket.io-client';

// Prefer current origin + Socket.IO path so Vite proxy can route to the server (8080)
const SOCKET_URL = import.meta?.env?.VITE_SOCKET_URL || window.location.origin;

// Initialize socket connection
const socket = io(SOCKET_URL, {
  path: '/socket.io',
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket'],
});

// Connect to the server
function connectSocket(role) {
  switch (role) {
    case 'Admin':
      socket.auth = { role: 'Admin' };
      break;
    case 'Super_Admin':
      socket.auth = { role: 'Super_Admin' };
      break;
    case 'User':
      socket.auth = { role: 'User' };
      break;
    default:
      socket.auth = { role: 'Guest' };
  }

  socket.connect();
}

export { socket, connectSocket };
