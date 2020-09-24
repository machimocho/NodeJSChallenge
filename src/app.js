//Cargar los módulos necesarios
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

//Cargar rutas
const rutasUsuario = require('./rutas/usuario')
const rutasSala = require('./rutas/sala')

const manejarErrores = require('./middlewares/manejarErrores')
const {AppError} = require('./utils/errores');

// Configurar Express
const app = express()
app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())

const ruta = '/api/v1'

//Establecer las rutas con su controlador
app.get(ruta + '/', (req, res) => {
    res.send({mensaje: 'API Deployed'})
})

app.use(ruta + '/usuarios',rutasUsuario)
app.use(ruta + '/salas',rutasSala)

app.all(ruta + '*', (req, res, next) => {
    next(new AppError(`La ruta ${req.originalUrl} no está disponible`, 404))
})

app.use(manejarErrores)

module.exports = app    