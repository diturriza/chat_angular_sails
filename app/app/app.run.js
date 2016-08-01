(function() {

  angular.module('chat').run(runBlock);

  runBlock.$inject = ['$rootScope', '$state', 'baseUrl', '$http'];

  function runBlock($rootScope, $state, baseUrl, $http) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      console.log('view change Start ');
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
      console.log('view Loaded');
    });
  }

}());
