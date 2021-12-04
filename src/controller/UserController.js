const bcrypt = require('bcrypt');
const Response = require('../services/response')
const Transformer = require('object-transformer')
const jwt = require('jsonwebtoken')
const user_transformer = require('../transformers/user')
const constant = require('../services/constant')
const {loginValidation, addUser} = require('../services/apivalidation')
const User = require('../models/user')

module.exports = {
    Login: async (req, res) => {
        const reqParam = req.body
        const user = await User.findOne({Username: reqParam.Username})
        if (!user) {
            return Response.successResponseWithoutData(
                res,
                res.locals.__('customerDoesnotExist'),
                constant.FAIL,
            )
        }
        loginValidation(reqParam, res, async (validate) => {
            bcrypt.compare(
                reqParam.password,
                user.password,
                async (err, result) => {
                    if (result) {
                        const token = jwt.sign(
                            {
                                id: user._id,
                            },
                            process.env.JWT_SECRET,
                            {algorithm: process.env.JWT_ALGO}
                        )
                        user.token = token
                        return Response.successResponseData(
                            res,
                            {
                                user: new Transformer.Single(user, user_transformer.detail).parse()
                            },
                            constant.SUCCESS,
                            res.locals.__('success'),
                        )
                    } else {
                        console.log(err)
                        return Response.successResponseWithoutData(
                            res,
                            res.locals.__('incorrectPassword'),
                            constant.FAIL,
                        )
                    }
                }
            )
        })
    },
    Regitration: async (req, res) => {
        const reqParam = req.body
        addUser(reqParam, res, async (validate) => {
            if (validate) {
                await bcrypt.hash(reqParam.password, 10, async function (err, hash) {

                    User.create({
                        password: hash,
                        Username: reqParam.Username,
                        skill_ids : reqParam.skill_ids,
                        level: reqParam.level,
                        xp: reqParam.xp,
                        trophies: reqParam.trophies,
                        gold: reqParam.gold,    
                        online: reqParam.online,
                        connected : reqParam.connected,
                    }).then(() => {
                        return Response.successResponseWithoutData(
                            res,
                            res.locals.__('success'),
                            constant.SUCCESS,
                        )
                    }).catch((e) => {
                        console.log(e)
                        if (e.code === 11000) {
                            return Response.successResponseWithoutData(
                                res,
                                res.locals.__('customerExist'),
                                constant.FAIL,
                            )
                        }
                        return Response.errorResponseData(
                            res,
                            res.__('internalError'),
                            constant.INTERNAL_SERVER
                        )
                    })
                });
            }
        })
    }
}
