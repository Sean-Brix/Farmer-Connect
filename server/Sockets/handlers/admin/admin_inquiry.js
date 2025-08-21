
function admin_inquiry(io, socket) {

    // Send Message
    socket.emit('client_inquiry:recieve', {
        message: 'Admin sent a message',
        socketId: socket.id,
    });
    
    // Recieve Message
    socket.on('admin_inquiry:recieve', (message) => {
        console.log(message);
    });

}

export { admin_inquiry };
