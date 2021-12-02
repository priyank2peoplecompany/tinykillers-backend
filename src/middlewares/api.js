const jwToken = require('../services/jwt')
const User = require('../models/user')
const Response = require('../services/response')

module.exports = {
    apiTokenAuth: async (req, res, next) => {
        const token = req.headers.authorization
        if (!token) {
            Response.errorResponseData(res, res.locals.__('authorizationError'), 401)
        } else {
            const tokenData = await jwToken.decode(token)
            if (tokenData) {
                jwToken.verify(tokenData, async (err, decoded) => {
                    if (err) {
                        Response.errorResponseData(res, res.locals.__('invalidToken'), 401)
                    } else {
                        if (decoded.id) {
                            req.customer_id = decoded.id
                            User.findById({
                                    _id: req.customer_id,
                            }).then((result) => {
                                if (!result) {
                                    return Response.errorResponseData(
                                        res,
                                        res.locals.__('invalidToken'),
                                        401
                                    )
                                } else {
                                    req.user = result
                                    return next()
                                }
                            })
                        } else {
                            Response.errorResponseData(res, res.locals.__('invalidToken'), 401)
                        }
                    }
                })
            } else {
                Response.errorResponseData(res, res.locals.__('invalidToken'), 401)
            }
        }
    },
}
