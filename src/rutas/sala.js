const express = require('express')
const router = new express.Router()

const salaController = require('../controladores/sala')

const verificar = require('../middlewares/verificar')

router.post('/', verificar, salaController.registrar)

// Obtener un usuario
router.get('/', verificar, salaController.obtenerSalas)

module.exports = router