const jwt = require('jsonwebtoken')
const Usuario = require('../modelos/usuario')

const verificar = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const usuario = await Usuario.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!usuario) {
            throw new Error()
        }

        req.id = decoded._id
        req.token = token
        next()
    } catch (e) {
        res.status(401).send({ 'mensaje': 'Favor de ingresar' })
    }
}

module.exports = verificar