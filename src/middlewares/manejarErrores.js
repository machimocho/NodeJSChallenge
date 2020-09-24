const { AppError } = require("../utils/errores")

const sendErrorDev = (err, res) => {
  console.log('sendErrorDev')
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    console.error("ERROR 💥: ", err)

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}

const handleCastErrorDB = err => {
  console.log('handleCastErrorDB')
  console.log(err)
  const message = `Valor inválido ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
  console.log('handleDuplicateFieldsDB')
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
  const message = `Valor duplicado: ${value}. Favor de usar otro`
  return new AppError(message, 409)
}

const handleValidationErrorDB = err => {
  console.log('handleValidationErrorDB')
  const errors = Object.values(err.errors).map(el => el.message)

  const message = `Dato ingresado inválido. ${errors.join(". ")}`
  return new AppError(message, 422)
}

const handleMulterError = err => {
  console.log('handleMulterError')
  let error
  switch (err.code){
    case 'LIMIT_FILE_SIZE':
        error = new AppError('El archivo es muy grande', 400)
      break;
    default:
      error = new AppError(err.message, 400)
  }
  return error
}

const verificarTipoError = err => {
  let error = { ...err }
  // Errores de Mongo
  if (error.name === "CastError") error = handleCastErrorDB(error)
  if (error.code === 11000) error = handleDuplicateFieldsDB(err)
  if (error.errors) error = handleValidationErrorDB(error)

  // Errores de carga de archivos
  if (error.name === "MulterError") error = handleMulterError(error)

  return error
}

const manejarErrores = (err, req, res, next) => {
  console.log(err)
  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"
  let error
  if (!(err instanceof AppError)){
    error = verificarTipoError(err)
  }else {
    error = { ...err }
  }
  if (error instanceof AppError) {
    if (process.env.NODE_ENV === "development") {
      sendErrorDev(error, res)
    } else if (process.env.NODE_ENV === "test") {
      sendErrorDev(error, res)
    }else if (process.env.NODE_ENV === "production") {
      sendErrorProd(error, res)
    }
  } else {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.mensaje || error.message
    })
  }
}

module.exports = manejarErrores
