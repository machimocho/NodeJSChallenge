const express = require('express')
const router = new express.Router()

const usuarioController = require('../controladores/usuario')

const verificar = require('../middlewares/verificar')
const {AppError} = require('../utils/errores')

router.post('/', usuarioController.registrar)

router.post('/login', usuarioController.login)

//Ruta de acceso al sistema
router.get('/sistema', verificar, (req, res) => {
    res.send('Área segura')
})

//Cerrar una sesión
router.post('/logout', verificar, usuarioController.logout)

//Cerrar todas las sesiones
router.post('/logoutCompleto', verificar, usuarioController.logoutCompleto)

// Obtener un usuario
router.get('/', verificar, usuarioController.obtener)

module.exports = router