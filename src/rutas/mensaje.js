const express = require('express')
const router = new express.Router()

const mensajeController = require('../controladores/mensaje')

const verificar = require('../middlewares/verificar')

router.post('/:room', verificar, mensajeController.registrar)

// Obtener un usuario
router.get('/:room', verificar, mensajeController.obtenerMensajes)

module.exports = router