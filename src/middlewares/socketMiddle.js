const jwToken = require('../services/jwt')
const User = require('../models/user')
const Response = require('../services/response')

module.exports = {
    socketTokenAuth: async (socket, next) => {
        const tokenData = await jwToken.decode(socket.handshake.headers.authorization)
        if (tokenData) {
            jwToken.verify(tokenData, async (err, decoded) => {
                if (err) {
                    next(new Error("invalidToken"))
                } else {
                    if (decoded.id) {
                        socket.customer_id = decoded.id
                        User.findById({
                                _id: socket.customer_id,
                        }).then((result) => {
                            if (!result) {
                                next(new Error("invalidToken"))
                            } else {
                                socket.user = result
                                return next()
                            }
                        })
                    } else {
                        next(new Error("invalidToken"))
                    }
                }
            })
        }
    },
}
