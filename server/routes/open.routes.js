var Router = require('express').Router();
var controllers = require('../controllers');
const openAuthentication = require('../middlewares/auth/auth.middleware').openAuthentication;

const routes = [

    //Quiz
    Router.post("/quiz/add", openAuthentication, controllers.quiz.AddQuiz),
    Router.get("/quiz/list", openAuthentication, controllers.quiz.ListQuiz),

    //User
    Router.post("/user/add", openAuthentication, controllers.user.AddUser),
    Router.get("/user/list", openAuthentication, controllers.user.ListUser),
    Router.post("/user/details", openAuthentication, controllers.user.DetailUser),
    Router.post("/user/answer", openAuthentication, controllers.user.QuizAnswer),

    //Suggestion Mail
    Router.post("/mail/send", openAuthentication, controllers.user.sendMail),

    //Blockchain API's
    Router.get('/blockchain/is-user-whitelist', controllers.blockchain.whitelist),
    Router.post('/blockchain/whitelist-user', controllers.blockchain.addAddressToWhitelist),
    Router.post('/blockchain/whitelist-users', controllers.blockchain.addAddressesToWhitelist),
    Router.post('/blockchain/remove-whitelist-user', controllers.blockchain.removeAddressFromWhitelist),
    Router.post('/blockchain/remove-whitelist-users', controllers.blockchain.removeAddressesFromWhitelist),
];

module.exports = routes;