const Sala = require('../modelos/sala')
const {AppError} = require('../utils/errores')
const catchAsync =  require('../utils/catchAsync')

const registrar = catchAsync(async (req, res) => {
    //Obtener valores
    const {room} = req.body

    //Realizar guardado
    const nuevaSala = new Sala({room})
    const salaGuardada = await nuevaSala.save()

    //Preparar los datos a enviar
    let datos = {}
    datos['mensaje'] = 'Room Created'
    datos['id'] = salaGuardada._id

    res.status(201).json(datos)
})

const obtenerSalas = catchAsync(async (req, res) => {
    let salas = await Sala.find({},'room').sort({room: "asc"})

    // If there is no chat room, create one
    if (salas.length < 1){
        let defaultRoom = {'room': 'Home'}
        const nuevaSala = new Sala(defaultRoom)
        await nuevaSala.save()
        salas = await Sala.find({}).sort({room: "asc"})
    }

    res.status(200).json(salas)
})

module.exports = {
    registrar,
    obtenerSalas
}