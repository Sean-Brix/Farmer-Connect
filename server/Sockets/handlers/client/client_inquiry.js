
function client_inquiry(io, socket) {


    console.log('Client Inquiry Socket Connected:', socket.id);

    // Send Message to Admin
    socket.on('client_inquiry:send', (message) => {

        console.log('Inquiry Message:', message);
        socket.emit('admin_inquiry:recieve', message);

    });

    // New Inquiry Event
    socket.on('client_inquiry:new', (data) => {

        console.log('inquiry: ', data);
        socket.emit('admin_inquiry:pending', { message: 'Add new pending inquiry' });

    });

    socket.on('disconnect', () => {
        console.log('Client Inquiry Socket Disconnected:', socket.id);
    }); 


}

export { client_inquiry };
