/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addConv: function(req, res) {
    var dataFromClient = req.params.all();
    if (req.isSocket && req.method === 'POST') {
      Chat.create(dataFromClient)
        .exec(function(err, dataFromClient) {
          //console.log(dataFromClient);
          Users.findOne({
              id: dataFromClient.user
            })
            .exec(function(err, user) {
              if (err) return res.serverError();
              if (_.isEmpty(user)) {
                return res.notFound();
              } else {
                Chat.publishCreate({
                  id: dataFromClient.id,
                  message: dataFromClient.message,
                  user: user.name
                });
              }
            });
        });
    } else if (req.isSocket) {
      var userId = req.param('id');
      Users.findOne({
          id: userId
        })
        .exec(function(err, user) {
          if (err) return res.serverError();
          if (_.isEmpty(user)) {
            return res.notFound();
          } else {
            delete user.encryptedPassword;
            var socketId = req.socket.id;
            user.socketId = socketId;
            user.save();
            Chat.watch(req.socket);
            Online.watch(req.socket);
            Online.publishCreate(user);
            sails.sockets.user = user;
            //console.log(sails.sockets.user);
            sails.config.online.users.push(userId);
            //console.log(sails.config.online);
            //console.log('User subscribed to ' + socketId);
          }
        });
    }
  },

  leave: function(req, res) {
    var userId = req.param('userId');
    Chat.unWatch(req.socket);
    Online.unWatch(req.socket);
    Online.publishDestroy(userId);
    var socketId = req.socket.id;
    sails.config.online.users.push(userId);
    //console.log(sails.config.online);
    //console.log('User unsubscribed to ' + socketId);
  },

  find: function(req, res) {
    Chat.find({})
      .populate('user')
      .exec(function chats(err, chatList) {
        if (err) return res.serverError(err);
        if (_.isEmpty(chatList)) {
          return res.notFound();
        } else {
          return res.ok(chatList);
        }
      });
  }
};
