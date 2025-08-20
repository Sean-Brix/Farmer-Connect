import dotenv from 'dotenv';

function setup_socket(io){

    dotenv.config();

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);   
        console.log(socket.handshake.auth);
    }); 

}

export { 
    setup_socket
};
