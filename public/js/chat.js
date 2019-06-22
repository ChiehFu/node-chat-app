const socket = io();

// Elements 
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMsgTemplate = document.querySelector('#location-msg-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options 
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoScroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of message container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('message', ({ username, message, createdAt }) => {
    //console.log({ username, message, createdAt });
    const html = Mustache.render(messageTemplate, {
        username,
        message,
        createdAt: moment(createdAt).format('h:mm a')
    });

    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
}); 

socket.on('locationMessage', ({ username, url, createdAt }) => {
    //console.log({ username, message, createdAt });
    const html = Mustache.render(locationMsgTemplate, {
        username,
        url,
        createdAt: moment(createdAt).format('h:mm a')
    });

    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
})

socket.on('roomData', ({ room, users }) => {
    console.log(room);
    console.log(users);
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html;
});

// Event listeners 
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // disable form
    $messageFormButton.setAttribute('disabled', 'disabled');

    const msg = e.target.elements.message.value;
    // console.log('Send: ', msg);
    socket.emit('sendMsg', msg, (error) => {
        // enable
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }
        console.log('Message delivered.');
    });
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

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
                $sendLocationButton.removeAttribute('disabled');
                console.log('Location shared!');
            });
        },
        error => {
            $sendLocationButton.removeAttribute('disabled');
            console.log(error);
        },
        {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000}
    );
});

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});