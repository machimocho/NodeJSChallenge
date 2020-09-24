const mongoose = require('mongoose')

let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
try{
    let url
    if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test')
        url = process.env.BD_URL_TESTING
    else
        url = process.env.BD_URL

    mongoose.connect(url, options, () => console.log ('Conexión establecida a la base de datos.'))
} catch (e){
    console.log(e)
}