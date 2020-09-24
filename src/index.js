const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 9999
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

server.listen(port, () => {
    console.log(`Chat server running on port --> ${port}`)
})