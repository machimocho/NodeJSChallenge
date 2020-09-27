const mongoose = require('mongoose')
const request = require('supertest')
const Usuario = require('../src/modelos/usuario')
require('dotenv').config()

const app = require('../app')

const usuarioValido = {
    nombre: 'Jobsity', 
    password: 'Acd12_', 
    password2: 'Acd12_'
}

describe('Rutas de Logueo', () => {
    let tokenUsuarioCreacion, tokenUsuarioLogin;

    beforeAll(async () => {
        await mongoose.connect(process.env.BD_URL_TESTING, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        })
    })

    afterAll(async (done) => {
        await Usuario.deleteMany({})
        await mongoose.connection.close()
        done()
    })

    it('debería crear un usuario', async (done) => {
        const res = await request(app)
            .post('/usuarios/registrar')
            .send(usuarioValido)
        expect(res.statusCode).toEqual(201)
        tokenUsuarioCreacion = res.body.token
        done()
    })  

    it('no debería crear el mismo usuario', async (done) => {
        const res = await request(app)
            .post('/usuarios/registrar')
            .send(usuarioValido)
        expect(res.statusCode).toEqual(409)
        done()
    })

    it('no debería ingresar con usuario inexistente', async (done) => {
        const res = await request(app)
            .post('/usuarios/login')
            .send({email: 'invalido@mail.com', password: '123456'})
        expect(res.statusCode).toEqual(400)
        done()
    })

    it('debería ingresar con usuario existente', async (done) => {
        const res = await request(app)
            .post('/usuarios/login')
            .send({email: usuarioValido.email, password: usuarioValido.password})
        expect(res.statusCode).toEqual(200)
        tokenUsuarioLogin = res.body.token
        done()
    })

    it('no debería usar la aplicación sin ingresar', async (done) => {
        const res =  await request(app)
            .get('/usuarios/sistema')
        expect(res.statusCode).toEqual(401)
        done()
    })

    it('no debería usar la aplicación usando token alterado', async (done) => {
        const res =  await request(app)
            .get('/usuarios/sistema')
            .set('Authorization', 'Bearer ' + tokenUsuarioCreacion + '123')
        expect(res.statusCode).toEqual(401)
        done()
    })

    it('debería usar la aplicación usando token(Creación)', async (done) => {
        const res =  await request(app)
            .get('/usuarios/sistema')
            .set('Authorization', 'Bearer ' + tokenUsuarioCreacion)
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('debería usar la aplicación usando token(Logueo)', async (done) => {
        const res =  await request(app)
            .get('/usuarios/sistema')
            .set('Authorization', 'Bearer ' + tokenUsuarioLogin)
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('debería cerrar sesión (token Creación)', async (done) => {
        const res = await request(app)
            .post('/usuarios/logout')
            .set('Authorization', 'Bearer ' + tokenUsuarioCreacion)
            .send()
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('no debería usar la aplicación usando token inválido(Creación)', async (done) => {
        const res =  await request(app)
            .get('/usuarios/sistema')
            .set('Authorization', 'Bearer ' + tokenUsuarioCreacion)
        expect(res.statusCode).toEqual(401)
        done()
    })

    it('debería seguir usando la aplicación usando token(Logueo)', async (done) => {
        const res =  await request(app)
            .get('/usuarios/sistema')
            .set('Authorization', 'Bearer ' + tokenUsuarioLogin)
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('debería cerrar todas las sesiones', async (done) => {
        const res = await request(app)
            .post('/usuarios/logoutCompleto')
            .set('Authorization', 'Bearer ' + tokenUsuarioLogin)
            .send()
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('no debería usar la aplicación usando token inválido(Logueo)', async (done) => {
        const res =  await request(app)
            .get('/usuarios/sistema')
            .set('Authorization', 'Bearer ' + tokenUsuarioLogin)
        expect(res.statusCode).toEqual(401)
        done()
    })
});
