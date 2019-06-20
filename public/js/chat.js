const msgFrom = document.querySelector('#message-form');
const sendMsg = document.querySelector('input');

let socket = io();

socket.on('message', (msg) => {
    console.log('Received: ', msg);
}); 

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.message;
    console.log('Send: ', msg);
    socket.emit('sendMsg', msg);
});
