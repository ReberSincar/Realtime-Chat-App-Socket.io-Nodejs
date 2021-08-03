const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message_utils');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app)
const io = socketio(server)

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// run when client connects
io.on('connection', socket => {
    socket.on('join-room', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.broadcast.to(user.room).emit('message', user.username + ' has joined the chat');
        io.to(user.room).emit('user-room', getRoomUsers(user.room));
    });

    socket.on("chat-message", msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('chat-message', formatMessage(user.username, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', user.username + ' has left the chat');
            io.to(user.room).emit('user-room', getRoomUsers(user.room));
        }
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log("Server running on port " + PORT));