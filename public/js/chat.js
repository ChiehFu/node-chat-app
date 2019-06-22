const msgFrom = document.querySelector('#message-form');
const sendMsg = document.querySelector('input');

let socket = io();

socket.on('message', (msg) => {
    console.log(msg);
}); 

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.message.value;
    // console.log('Send: ', msg);
    socket.emit('sendMsg', msg, (error) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message delivered.');
    });
});

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            //console.log('latitude :', latitude);
            //console.log('longitude :', longitude);
            socket.emit('sendLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, (error) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Location shared!');
            });
        },
        error => {
            console.log(error);
        },
        {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000}
    );
});
