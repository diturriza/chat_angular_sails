(function() {
  'use strict';

  angular.module('chat').factory('socket', socket);

  socket.$inject = ['$rootScope', 'baseUrl']

  function socket($rootScope, baseUrl) {

    mySocket = {
    };

    return mySocket;

  };

})();
