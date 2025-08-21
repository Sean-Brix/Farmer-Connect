
function client_inquiry(io, socket) {

    // Send Message
    socket.emit('admin_inquiry:recieve', {
        message: 'Client sent a message',
        socketId: socket.id,
    });
    
    // Recieve Message
    socket.on('client_inquiry:recieve', (message) => {
        console.log(message);
    });

}

export { client_inquiry };
