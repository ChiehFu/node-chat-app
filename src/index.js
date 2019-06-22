const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const pubilcDir = path.join(__dirname, '../public');

app.use(express.static(pubilcDir));

let count = 0;

io.on('connection', (socket) => {
    // console.log('New Websocket connection');
    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user has joined!')


    socket.on('sendMsg', (msg, callback) => {
        //console.log('Received :', msg);
        const filter = new Filter();

        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed!');
        }

        io.emit('message', msg);
        callback();
    });

    socket.on('sendLocation', ({latitude, longitude}, callback) => {
        const url = 'https://google.com/maps?q=';
        io.emit('message', `${url}${latitude},${longitude}`);
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!');
    });
});

server.listen(port, () => {
    console.log('Server is up on port ', port);
})