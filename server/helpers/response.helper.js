var statusString = {
    0: parseInt(204), // No Content
    1: parseInt(200)  // OK 
};
const CryptoJS = require("crypto-js");
require('dotenv-expand')(require('dotenv').config());

const key = CryptoJS.enc.Base64.parse(`${process.env.SECRET_KEY}`);
const iv = CryptoJS.enc.Base64.parse(`${process.env.SECRET_IV}`);
const option = { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv };
/**
 * -------------------------------------------------------------------
 * Start : Helper Functions to modify the response
 * -------------------------------------------------------------------
 */

const send = (res, data = [], message = 'Success') => {
    //console.log("Response Data===>", data)
    if (`${process.env.ENABLED_ENCRYPTION}` == 'true') data = _encrypt(data);
    response = { status: statusString[1], data, message };
    return res.send(response);
}

const end = (res) => {
    return res.end();
}

const error = (res, message = 'Something went wrong, please try after some time', data = {}) => {

    if (`${process.env.ENABLED_ENCRYPTION}` == 'true') data = _encrypt(data);
    response = { status: statusString[0], error: data, message };
    //response = { status: statusString[0], message }; // Remove data from error response
    return res.send(response);
}

const vfaild = (res, response) => {
    response = { ...response, status: 400 };
    console.log('--------------->', response);
    return res.status(400).send(response);
}

const statusError = (res, status = 400, message = 'Something went wrong, please try after some time') => {
    response = { status, data: [], message };
    //response = { status, message }; // Remove data from error response
    return res.status(status).send(response);
}

/**
 * -------------------------------------------------------------------
 * End : Helper Functions to modify the response
 * -------------------------------------------------------------------
 */

const _encrypt = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key, option).toString();
}

const _decrypt = (data) => {
    return JSON.parse(CryptoJS.AES.decrypt(data, key, option).toString(CryptoJS.enc.Utf8));
}

module.exports = { send, end, error, statusError, vfaild };