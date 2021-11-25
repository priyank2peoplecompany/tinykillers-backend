
var Router = require('express').Router();
var controllers = require('../controllers');
const openAuthentication = require('../middlewares/auth/auth.middleware').openAuthentication;

const routes = [
    
    //Quiz
    Router.post("/quiz/add", openAuthentication, controllers.quiz.AddQuiz),
    Router.get("/quiz/list", openAuthentication, controllers.quiz.ListQuiz),
    Router.post("/quiz/code", openAuthentication, controllers.quiz.checkCode),
    
    //User
    Router.post("/user/add", openAuthentication, controllers.user.AddUser),
    Router.get("/user/list", openAuthentication, controllers.user.ListUser),

    //Suggestion Mail
    Router.post("/mail/send", openAuthentication, controllers.user.sendMail),

];

module.exports = routes;