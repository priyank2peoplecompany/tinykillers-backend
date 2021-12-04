const socketAuth = require("../middlewares/socketMiddle");
const User = require("../models/user");
const constant = require("../services/constant");
const user_transformer = require('../transformers/user')
const Transformer = require('object-transformer')

exports = module.exports = function (io) {
  const storeConnectedUser = [];
  io.use(async (socket, next) => {
    await socketAuth.socketTokenAuth(socket, next);
  });
  io.sockets.on("connection", async function (socket) {
    const user = socket.user;
    var index = storeConnectedUser.findIndex((d) => d.userName === user.Username);
    await User.findOneAndUpdate(
        { _id: user._id },
        { online: constant.ONLINE }
      );
    if(index === -1){
        storeConnectedUser.push({
            soketId: socket.id,
            userName: user.Username,
          });
    } else {
        storeConnectedUser.splice(index, 1);
        storeConnectedUser.push({
            soketId: socket.id,
            userName: user.Username,
          });
    }


    socket.on("disconnect", async function () {
      await User.findOneAndUpdate(
        { _id: user._id },
        { online: constant.OFFLINE, connected: constant.NOT_CONNECTED }
      );
      var index = storeConnectedUser.findIndex((d) => d.soketId === socket.id);
      if (index !== -1) {
        storeConnectedUser.splice(index, 1);
      }
    });

    socket.on("startConnection", async function () {
      const vsPlayer = await User.findOne({
        level: user.level,
        _id: {
          $ne: user.id,
        },
        connected: constant.NOT_CONNECTED,
        online: constant.ONLINE,
      });
      if (vsPlayer) {
        const getVsPlayerSocketId = storeConnectedUser.find(
          (d) => d.userName === vsPlayer.Username
        );
        if(getVsPlayerSocketId && getVsPlayerSocketId.soketId){
            io.to(socket.id).emit('sendVsPlayer',  new Transformer.Single(vsPlayer, user_transformer.detail).parse());
            io.to(getVsPlayerSocketId.soketId).emit('sendVsPlayer',  new Transformer.Single(user, user_transformer.detail).parse());
        }
      }
    });
  });
};
