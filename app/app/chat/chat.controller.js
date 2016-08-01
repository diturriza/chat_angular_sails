(function() {
  'use strict';

  angular
    .module('chat')
    .controller('chatController', chatController);

chatController.$inject = ['dataService', '$state', '$http', 'baseUrl', '$scope', '$rootScope'];

  function chatController(dataService, $state, $http, baseUrl, $scope, $rootScope) {
  /* @ngInject */
    var vm = this;
    vm.sendMsg = sendMsg;
    vm.chatList = [];
    vm.user = {};
    vm.chatUser = "Daniel";
    vm.chatMessage = "";
    activate();


    $rootScope.$on('chatList', function (event, data) {
      console.log(data);
      vm.chatList.push(data);
      $scope.$apply();
    });


    function activate() {
      console.log('chat View activate');
      getAllChat();
    }

    function getAllChat() {
      io.socket.get('/chat/addconv');
      $http.get(baseUrl + '/chat')
        .success(function(success_data) {
          vm.chatList = success_data;
          console.log(success_data);
        });
    }

    function sendMsg() {
      console.log(vm.chatMessage);
      io.socket.post('/chat/addconv/', {
        user: vm.chatUser,
        message: vm.chatMessage
      });
      vm.chatMessage = "";
    }
  }
})();
