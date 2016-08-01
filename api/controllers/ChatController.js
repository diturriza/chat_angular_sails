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
          console.log(dataFromClient);
          Chat.publishCreate({
            id: dataFromClient.id,
            message: dataFromClient.message,
            user: dataFromClient.user
          });
        });
    } else if (req.isSocket) {
      Chat.watch(req.socket);
      var userId = req.param('id');
      // Get the session from the request
      var session = req.session;
      // Create the session.users hash if it doesn't exist already
      session.users = session.users || {};
      var socketId = req.socket.id;
      session.users[socketId] = userId;
      console.log(session.users);
      console.log('User subscribed to ' + socketId);
    }
  },

  find: function(req, res) {
    Chat.find({})
      .populate('user')
      .exec(function chats(err, chatList) {
        if (err) return res.serverError(err);
        console.log(chatList);
        if (_.isEmpty(chatList)) {
          return res.notFound();
        } else {
          return res.ok(chatList);
        }
      });
  }
};
