const chatForm = document.getElementById('chat-form');
const msg = document.getElementById('msg');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

// Join room
socket.emit('join-room', { username, room });

socket.on('message', message => {
    outputMessage(message);
});

socket.on('chat-message', message => {
    outputChatMessage(message);
});

socket.on('user-room', userList => {
    roomName.innerText = room;
    users.innerHTML = "";
    userList.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        users.appendChild(li);
    });
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(msg.value);
    socket.emit('chat-message', msg.value);
    msg.value = "";
});

function outputChatMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = '<p class="meta">' + message.username + ' <span>' + message.time + '</span></p> <p class="text">' + message.text + '</p>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = '<p class="text">' + message + '</p>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}