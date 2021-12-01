const bcrypt = require('bcrypt');
const moment = require('moment')
const Response = require('../services/response')
const fs = require('fs');
const path = require('path')
const Transformer = require('object-transformer')
const jwt = require('jsonwebtoken')
const user_transformer = require('../transformers/user')
const constant = require('../services/constant')
const {loginValidation, addUser} = require('../services/apivalidation')
const User = require('../models/user')

module.exports = {
    Login: async (req, res) => {
        const reqParam = req.body
        const user = await User.findOne({email: reqParam.email})
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
                            'secret',
                            {algorithm: 'HS512'}
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
    AddCustomer: async (req, res) => {
        const reqParam = req.body
        addUser(reqParam, res, async (validate) => {
            if (validate) {
                await bcrypt.hash(reqParam.password, 10, async function (err, hash) {

                    User.create({
                        password: hash,
                        Username: reqParam.username,
                        skill_ids : reqParam.skill_ids,
                        level: reqParam.level,
                        xp: reqParam.xp,
                        trophies: reqParam.trophies,
                        gold: reqParam.gold,
                        online: reqParam.online,
                        connected : reqParam.connected,
                        email: reqParam.email,
                        gender: reqParam.gender,
                        mobile: reqParam.mobile
                    }).then(() => {
                        return Response.successResponseWithoutData(
                            res,
                            res.locals.__('success'),
                            constant.SUCCESS, ``
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
