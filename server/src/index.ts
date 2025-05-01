import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
const http = require('http');
import cookieParser from 'cookie-parser';
const { Server } = require('socket.io');
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // frontend URL
        methods: ["GET", "POST"]
    }
});

let users = {};

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('join', (username) => {
        users[socket.id] = username;
        io.emit('user_list', Object.values(users));

        io.emit('receive_message', {
            sender: 'system',
            message: `${username} joined the chat`,
            type: 'system',
        });

        io.emit('status_update', { user: username, status: 'online' });
    });

    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });

    socket.on('typing', (username) => {
        socket.broadcast.emit('user_typing', username);
    });

    socket.on('stop_typing', () => {
        socket.broadcast.emit('user_typing', null);
    });

    socket.on('leave', () => {
        const username = users[socket.id]
        delete users[socket.id];
        io.emit('receive_message', {
            sender: 'system',
            message: `${username} left the chat`,
            type: 'system',
        });
         io.emit('status_update', { user: username, status: 'offline' });
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit('user_list', Object.values(users));

        // Broadcast system message
        io.emit('receive_message', {
            sender: 'system',
            message: `${username} left the chat`,
            type: 'system',
        });

        io.emit('status_update', { user: username, status: 'offline' });
    });
});


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI!).then(() => console.log('DB connected'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

server.listen(5000, () => {
    console.log('Socket server running on http://localhost:5000');
});
app.listen(5000, () => console.log('Server running on port 5000'));


