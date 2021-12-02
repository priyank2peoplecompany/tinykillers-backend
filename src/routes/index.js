const route = require('express').Router()
const UserController = require('../controller/UserController')
const SkillsController = require('../controller/SkillsController')

const { apiTokenAuth } = require('../middlewares/api')
const connect = require('connect')

const authMiddleware = (() => {
    const chain = connect();
    [apiTokenAuth].forEach((middleware) => {
        chain.use(middleware)
    })
    return chain
})()

route.post('/login', UserController.Login)
route.post('/sign-up', UserController.Regitration)
route.post('/add-user-skills', authMiddleware, SkillsController.AddUserSkills)
route.get('/list-skiils', authMiddleware, SkillsController.ListSkills)

module.exports = route

