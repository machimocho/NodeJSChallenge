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

server.listen(port, () => {
    console.log(`Chat server running on port --> ${port}`)
})