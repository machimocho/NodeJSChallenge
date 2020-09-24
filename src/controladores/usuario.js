const Usuario = require('../modelos/usuario')
const {AppError} = require('../utils/errores')
const catchAsync =  require('../utils/catchAsync')

const registrar = catchAsync(async (req, res) => {
    //Obtener valores
    const {username, password, password2} = req.body

    //Verificar que las contraseñas coincidan
    if (password !== password2)
        throw new AppError('Password missmatch', 422)

    //Realizar guardado
    const nuevoUsuario = new Usuario({username, password})
    const usuarioGuardado = await nuevoUsuario.save()
    const token = await usuarioGuardado.generarToken()

    //Preparar los datos a enviar
    let datos = {}
    datos['mensaje'] = 'User Created'
    datos['token'] = token

    res.status(201).json(datos)
})

const login = catchAsync(async (req, res) => {
    //Obtener valores
    const {email, password} = req.body

    //Verificar usuario
    const usuarioEncontrado = await Usuario.encontrarCredenciales(email, password)
    const token = await usuarioEncontrado.generarToken()
    
    //Preparar los datos a enviar
    let datos = {}
    datos['mensaje'] = 'Usuario Autorizado'
    datos['token'] = token

    res.status(200).json(datos)
})

const logout = catchAsync(async (req, res) => {
    //Se obtiene el usuario
    const usuario = await Usuario.findById(req.id)

    //Se retira el token
    usuario.tokens = usuario.tokens.filter((token) => {
        return token.token !== req.token
    })

    await usuario.save()

    res.status(200).send()
})

const logoutCompleto = catchAsync(async (req, res) => {
    //Se obtiene el usuario
    const usuario = await Usuario.findById(req.id)

    //Se retiran todos los token
    usuario.tokens = []
    
    await usuario.save()

    res.status(200).send()
})

const obtener = catchAsync(async (req, res) => {
    const usuario = await Usuario.findById(req.id)

    console.log(req.id)

    //Preparar los datos a enviar
    let datos = {}
    datos.username = usuario.username

    res.status(200).json(datos)
})

module.exports = {
    registrar,
    login,
    logout,
    logoutCompleto,
    obtener
}