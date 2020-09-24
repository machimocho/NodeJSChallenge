const mongoose = require('mongoose')
const { AppError } = require("../utils/errores")

mongoose.set('useCreateIndex', true)

const SalaSchema = new mongoose.Schema({
    room:{
        type: mongoose.ObjectId,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

const Sala = mongoose.model('Sala', SalaSchema)

module.exports = Sala