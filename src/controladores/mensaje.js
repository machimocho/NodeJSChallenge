const Mensaje = require('../modelos/mensaje')
const catchAsync =  require('../utils/catchAsync')

const registrar = catchAsync(async (req, res) => {
    //Obtener valores
    const {message} = req.body
    const id = req.id
    const room = req.params.room

    //Realizar guardado
    const nuevoMensaje = new Mensaje({user: id, room, message})
    await nuevoMensaje.save()

    res.status(201).send()
})

const obtenerMensajes = catchAsync(async (req, res) => {
    const mensajes = await Mensaje.find({room: req.params.room},'user  message createdAt').populate('user', 'username').sort({createdAt: 'asc'})

    res.status(200).json(mensajes)
})

module.exports = {
    registrar,
    obtenerMensajes
}