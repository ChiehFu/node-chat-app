const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const pubilcDir = path.join(__dirname, '../public');

app.use(express.static(pubilcDir));

let count = 0;

io.on('connection', (socket) => {
    console.log('New Websocket connection');
    socket.emit('message', 'Welcome!');

    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdated', count);
    //     io.emit('countUpdated', count);
    // })
    socket.on( 'sendMsg', (msg) => {
        console.log('Received :', msg);
        io.emit('message', msg);
    });
});

server.listen(port, () => {
    console.log('Server is up on port ', port);
})