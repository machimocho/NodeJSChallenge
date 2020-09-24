const mongoose = require('mongoose')
const { AppError } = require("../utils/errores")

mongoose.set('useCreateIndex', true)

const MensajeSchema = new mongoose.Schema({
    username:{
        type: mongoose.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    room:{
        type: mongoose.ObjectId,
        required: true,
        ref: 'Sala'
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
}, {
    timestamps: true
})

const Mensaje = mongoose.model('Mensaje', MensajeSchema)

module.exports = Mensaje