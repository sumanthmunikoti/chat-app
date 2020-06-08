const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
    console.log('New Connection')
    socket.on ('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room})

        if(error) return callback(error)
        socket.join(user.room)
        socket.emit('message', { user: 'admin', text: `Hello ${user.name}!, Welcome to room ${user.room}`})
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined the chat`})

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', { user : user.name, text: message})
        callback()
    })

    socket.on('sendCode', (code, callback) => {
        // console.log(code)
        const user = getUser(socket.id)
        io.to(user.room).emit('code', { user : user.name, text: code })
        callback()
    })


    socket.on('disconnect', () => {
        console.log("User has left")
    })
})

app.use(router)

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
