const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)

const SalaSchema = new mongoose.Schema({
    room:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
}, {
    timestamps: true
})

const Sala = mongoose.model('Sala', SalaSchema)

module.exports = Sala