
const CryptoJS = require("crypto-js");
require('dotenv-expand')(require('dotenv').config());

// check for if user is logged in or not
const isAuthentication = true;

// check for if user is authorized for the api call or not
const isAuthorization = true;

var key = CryptoJS.enc.Base64.parse(`${process.env.SECRET_KEY}`);
var iv = CryptoJS.enc.Base64.parse(`${process.env.SECRET_IV}`);
var option = { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv };


exports.openAuthentication = (req, res, next) => {

    if (req.body.data) {
        req.body = JSON.parse(CryptoJS.AES.decrypt(req.body.data, key, option).toString(CryptoJS.enc.Utf8));
    }
    next();
}