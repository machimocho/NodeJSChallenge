const mongoose = require('mongoose')
const request = require('supertest')
const Usuario = require('../src/modelos/usuario')
require('dotenv').config()

const app = require('../src/app')

const usuarioValido = {
    username: 'Jobsity', 
    password: 'Acd12_', 
    password2: 'Acd12_'
}

describe('API routes', () => {
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

    it('should create a user', async (done) => {
        const res = await request(app)
            .post('/api/v1/usuarios')
            .send(usuarioValido)
        expect(res.statusCode).toEqual(201)
        tokenUsuarioCreacion = res.body.token
        done()
    })  

    it('should not create the same user', async (done) => {
        const res = await request(app)
            .post('/api/v1/usuarios')
            .send(usuarioValido)
        expect(res.statusCode).toEqual(409)
        done()
    })

    it('should not login with unexisting user', async (done) => {
        const res = await request(app)
            .post('/api/v1/usuarios')
            .send({username: 'username', password: '123456'})
        expect(res.statusCode).toEqual(422)
        done()
    })

    it('should login with existing user', async (done) => {
        const res = await request(app)
            .post('/api/v1/usuarios/login')
            .send({username: usuarioValido.username, password: usuarioValido.password})
        expect(res.statusCode).toEqual(200)
        tokenUsuarioLogin = res.body.token
        done()
    })

    it('should not use the app without login', async (done) => {
        const res =  await request(app)
            .get('/api/v1/usuarios/sistema')
        expect(res.statusCode).toEqual(401)
        done()
    })

    it('shoult not use the app with altered token', async (done) => {
        const res =  await request(app)
            .get('/api/v1/usuarios/sistema')
            .set('Authorization', 'Bearer ' + tokenUsuarioCreacion + '123')
        expect(res.statusCode).toEqual(401)
        done()
    })

    it('should use the app using registration token', async (done) => {
        const res =  await request(app)
            .get('/api/v1/usuarios/sistema')
            .set('Authorization', 'Bearer ' + tokenUsuarioCreacion)
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('should use the app using login token', async (done) => {
        const res =  await request(app)
            .get('/api/v1/usuarios/sistema')
            .set('Authorization', 'Bearer ' + tokenUsuarioLogin)
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('should close session (register token)', async (done) => {
        const res = await request(app)
            .post('/api/v1/usuarios/logout')
            .set('Authorization', 'Bearer ' + tokenUsuarioCreacion)
            .send()
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('should not use the app with invalid token (registration token)', async (done) => {
        const res =  await request(app)
            .get('/api/v1/usuarios/sistema')
            .set('Authorization', 'Bearer ' + tokenUsuarioCreacion)
        expect(res.statusCode).toEqual(401)
        done()
    })

    it('should still use the app using login token', async (done) => {
        const res =  await request(app)
            .get('/api/v1/usuarios/sistema')
            .set('Authorization', 'Bearer ' + tokenUsuarioLogin)
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('should close all sessions', async (done) => {
        const res = await request(app)
            .post('/api/v1/usuarios/logoutCompleto')
            .set('Authorization', 'Bearer ' + tokenUsuarioLogin)
            .send()
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('should not use the app with invalid token (login token)', async (done) => {
        const res =  await request(app)
            .get('/api/v1/usuarios/sistema')
            .set('Authorization', 'Bearer ' + tokenUsuarioLogin)
        expect(res.statusCode).toEqual(401)
        done()
    })
});
