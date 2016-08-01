(function() {

  angular.module('chat').run(runBlock);

  runBlock.$inject = ['$rootScope', '$state', 'baseUrl', '$http'];

  function runBlock($rootScope, $state, baseUrl, $http) {

    // io.sails.autoConnect = false;
    // io.sails.environment = 'development';
    // io.sails.connect(baseUrl);
    console.log("url",io.sails.url);

    if (localStorage['Token']) {
      console.log("estoy donde pienso rey");
      $http.defaults.headers.common.Authorization = localStorage['Token'];
      io.socket.on('chat', function(obj) {
        if (obj.verb === 'created') {
          console.log(obj);
          $rootScope.$emit('chatList', obj.data);
        }
      });
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      console.log('view change Start ');
    });

    $rootScope.$on('$viewContentLoaded', function() {
      console.log('view Loaded');
    });
  }

}());
