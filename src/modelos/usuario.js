const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const { AppError } = require("../utils/errores")

mongoose.set('useCreateIndex', true)

const UsuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// Ejecutar antes del guardado para encriptar la contraseña
UsuarioSchema.pre("save", async function(callback) {
    var usuario = this

    // Verificar si la contraseña ha cambiado
    if (!usuario.isModified("password")) return callback()

    // La contraseña es distinta. Se procede a encriptar
    try{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(usuario.password, salt)
        usuario.password = hash
        callback()
    } catch(e){
        return callback(err)
    }
})

//Función para comparar contraseñas
UsuarioSchema.methods.verificarPassword = async function(passwordIU, passwordBD, cb) {
    try{
        const isMatch = await bcrypt.compare(passwordIU, passwordBD)
        cb(null, isMatch)
    } catch(e){
        return cb(err, false)
    }
}

//Crear un token y agregarlo al listado
UsuarioSchema.methods.generarToken = async function () {
    const usuario = this
    const token = jwt.sign({ _id: usuario._id.toString() }, process.env.JWT_SECRET)

    usuario.tokens = usuario.tokens.concat({ token })
    await usuario.save()

    return token
}

//Encontrar un usuario por correo y contraseña
UsuarioSchema.statics.encontrarCredenciales = async (username, password) => {
    const usuario = await Usuario.findOne({ username })

    if (!usuario) {
        throw new AppError('Usuario no existe', 400)
    }

    const esValida = await bcrypt.compare(password, usuario.password)

    if (!esValida) {
        throw new AppError('Contraseña incorrecta', 400)
    }

    return usuario
}

const Usuario = mongoose.model('Usuario', UsuarioSchema)

module.exports = Usuario