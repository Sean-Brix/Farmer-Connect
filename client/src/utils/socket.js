import { io } from 'socket.io-client';

// Initialize socket connection  
const socket = io("http://localhost:8080", {
  autoConnect: false,
  withCredentials: true,
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

export {
  socket,
  connectSocket
}
