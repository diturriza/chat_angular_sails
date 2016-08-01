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
      vm.user = JSON.parse(dataService.getUser());
      console.log(vm.user);
      vm.chatUser = vm.user.name;
      vm.chatMessage = "";
      vm.logout = logout;
      activate();


      $rootScope.$on('chatList', function(event, data) {
        console.log(data);
        vm.chatList.push(data);
        $scope.$apply();
      });


      function activate() {
        console.log('chat View activate');
        getAllChat();
      }

      function getAllChat() {
        io.socket.get('/chat/addconv/'+vm.user.id);
        $http.get(baseUrl + '/chat')
          .success(function(success_data) {
            vm.chatList = success_data;
            // console.log("Desde el ctrl",success_data);
          });
      }

      function sendMsg() {
        io.socket.post('/chat/addconv', {
            user: vm.user,
            message: vm.chatMessage},
            function(resData, jwres) {
              console.log(resData);
              console.log(jwres.statusCode);
            });
             vm.chatMessage = "";
        }

        function logout() {
          dataService.logout();
        }
      }
    })();
