(function() {
  'use strict';

  angular
    .module('chat')
    .controller('chatController', chatController);

  chatController.$inject = ['dataService', '$state', '$http', 'baseUrl', '$scope', '$rootScope', '$animate',
    'usSpinnerService'
  ];

  function chatController(dataService, $state, $http, baseUrl, $scope, $rootScope, $animate, usSpinnerService) {
    /* @ngInject */
    var vm = this;
    vm.sendMsg = sendMsg;
    vm.chatList = [];
    vm.user = JSON.parse(dataService.getUser());
    vm.chatUser = vm.user.name;
    vm.chatMessage = "";
    vm.logout = logout;
    vm.onlineUsers = [];
    activate();
    io.socket.on('online', function(obj) {
      if (obj.verb === 'created') {
        vm.onlineUsers.push(obj.data);
        $scope.$apply();
      } else if (obj.verb === 'destroyed') {
        vm.onlineUsers = _.filter(vm.onlineUsers, function(o) {
          return o.id != obj.id;
        })
      }
    });

    io.socket.get('/online', function(resData, jwres) {
      vm.onlineUsers = resData;
      $scope.$apply();
    })

    $rootScope.$on('chatList', function(event, data) {
      //console.log(data);
      vm.chatList.push(data);
      $scope.$apply();
    });


    function activate() {
      getAllChat();
    }

    function getAllChat() {
      io.socket.get('/chat/addconv/' + vm.user.id);
      $http.get(baseUrl + '/chat')
        .success(function(success_data) {
          usSpinnerService.stop('spinnerGeneric');
          vm.chatList = success_data;
          var $cont = angular.element('body');
          $('body').animate({
            scrollTop: $cont[0].scrollHeight
          }, "slow");
        });
    }

    function sendMsg() {
      io.socket.post('/chat/addconv', {
          user: vm.user,
          message: vm.chatMessage
        },
        function(resData, jwres) {
          // //console.log(resData);
          // //console.log(jwres.statusCode);
        });
      vm.chatMessage = "";
    }

    function logout() {
      dataService.logout();
    }
  }
})();
