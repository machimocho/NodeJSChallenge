const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

//Cargar Aplicación
const app = require('./app')

const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 9999
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

//Conectar a la Base de Datos
require('./utils/conectarBD')

// Initialize SocketIO
const { generateMessage } = require('./utils/chat/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/chat/users')

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('login', (options, callback) => {
        socket.emit('message', generateMessage('Admin', `Welcome ${options.username}! Please choose a room.`))

        callback()
    })

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', `You're now on ${user.room}`))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('leave', (options, callback) => {
        const user = removeUser(socket.id)
        if (user) {
            socket.leave(user.room)

            // socket.emit('message', generateMessage('Admin', `You left ${user.room}`))
            socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the room!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has disconnected from the app!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Chat server running on port --> ${port}`)
})