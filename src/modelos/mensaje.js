const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)

const MensajeSchema = new mongoose.Schema({
    user:{
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