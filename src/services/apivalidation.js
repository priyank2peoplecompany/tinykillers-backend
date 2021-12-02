const Joi = require('@hapi/joi')
const Response = require('./response')
const Helper = require('./helper')

module.exports = {
    loginValidation: (req, res, callback) => {
        const schema = Joi.object({
            Username:Joi.required(),
            password: Joi.string().trim().min(8).max(100).required(),
        })
        const { error } = schema.validate(req)
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('loginValidation', error))
            )
        }
        return callback(true)
    },
    addUser: (req, res, callback) => {
        const schema = Joi.object({
            Username:Joi.required(),
            level:Joi.number().required(),
            xp:Joi.number().required(),
            trophies:Joi.number().required(),
            connected:Joi.boolean().required(),
            skill_ids:Joi.array().required(),
            gold:Joi.number().required(),
            online: Joi.boolean().required(),
            password: Joi.string().trim().min(8).max(100).required(),
        })
        const { error } = schema.validate(req)
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('userRegistrationValidation', error))
            )
        }
        return callback(true)
    },
    addUserSkilles: (req, res, callback) => {
        const schema = Joi.object({
            skill_ids:Joi.array().required(),
        })
        const { error } = schema.validate(req)
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('userSkillValidation', error))
            )
        }
        return callback(true)
    },
}
