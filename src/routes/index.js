const route = require('express').Router()
const UserController = require('../controller/UserController')

const { apiTokenAuth } = require('../middlewares/api')
const connect = require('connect')

const authMiddleware = (() => {
    const chain = connect();
    [apiTokenAuth].forEach((middleware) => {
        chain.use(middleware)
    })
    return chain
})()


route.post('/login',UserController.Login)
route.post('/sign-up',UserController.AddCustomer)

module.exports = route

