(function() {

  angular.module('chat').run(runBlock);

  runBlock.$inject = ['$rootScope', '$state', 'baseUrl', '$http', 'usSpinnerService'];

  function runBlock($rootScope, $state, baseUrl, $http, usSpinnerService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      usSpinnerService.spin('spinnerGeneric');
      //console.log('view change Start');
      $rootScope.currentState = toState.name;

      if (!toState.authenticate && !_.isEmpty(localStorage.getItem('Token'))) {
        event.preventDefault();
        $state.go('chat');
        $rootScope.currentState = 'chat';
      }
      if (toState.authenticate && _.isEmpty(localStorage.getItem('Token'))) {
        event.preventDefault();
        $state.go('login');
        $rootScope.currentState = 'login';
      }
      if (localStorage['Token']) {
        $http.defaults.headers.common.Authorization = localStorage['Token'];
        if (typeof io.socket === 'undefined') {
          io.sails.useCORSRouteToGetCookie = false;
          io.sails.headers = {
            Authorization: $http.defaults.headers.common.Authorization
          }
          io.socket = io.sails.connect(baseUrl, io.sails.transports, {
            'Authorization': $http.defaults.headers.common.Authorization
          });
          io.socket.on('chat', function(obj) {
            if (obj.verb === 'created') {
              $rootScope.$emit('chatList', obj.data);
            }
          });
        }
      }
    });

    $rootScope.$on('$viewContentLoaded', function() {
      //console.log('view Loaded');

    });
  }

}());
