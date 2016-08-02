(function() {
  'use strict';

  angular
    .module('chat')
    .factory('dataService', dataService);

  dataService.$inject = ['$http', 'baseUrl', '$q', '$state', '$rootScope'];

  /* @ngInject */
  function dataService($http, baseUrl, $q, $state, $rootScope) {
    var dataService = {
      getAllChat: getAllChat,
      register: register,
      login: login,
      isAuthenticated: isAuthenticated,
      logout: logout,
      setAuthenticatedAccount: setAuthenticatedAccount,
      usersOnline: usersOnline,
      getUser: getUser,
      getToken: getToken
    };

    return dataService;

    function getAllChat() {
      var deferred = $q.defer();
      $http.get(baseUrl + '/chat')
        .then(function(response, status, headers, config) {
            deferred.resolve(response.data);
          },
          function(status) {
            deferred.reject(status);
          });
      return deferred.promise;
    }

    function register(user) {
      var deferred = $q.defer();
      $http.post(baseUrl + '/users/', user)
        .then(function(response, status, headers, config) {
            dataService.setAuthenticatedAccount(response).then(function() {
              deferred.resolve(response.data);
            });
          },
          function(status) {
            deferred.reject(status);
          });
      return deferred.promise;
    }

    function login(user) {
      var deferred = $q.defer();
      $http.post(baseUrl + '/auth/', user)
        .then(function(response, status, headers, config) {
            dataService.setAuthenticatedAccount(response).then(function() {
              deferred.resolve(response.data);
            });
          },
          function(status) {
            deferred.reject(status);
          });
      return deferred.promise;
    }

    function isAuthenticated() {
      return !!(localStorage.getItem('Token'));
    }

    function getUser() {
      return !!(localStorage.getItem('Token')) ? localStorage.getItem('User') : null;
    }

    function logout(userId) {
      $http.defaults.headers.common.Authorization = '';
      localStorage.removeItem('Token');
      localStorage.removeItem('User');
      io.socket.delete('chat/leave/'+userId, {}, function(data, jwres) {
        //console.log(data);
      });
      io.socket.off('chat', function(obj) {
        //console.log(obj);
      });
      io.socket.off('online', function(obj) {
        //console.log(obj);
      });
      $state.go('login');
    }

    function setAuthenticatedAccount(response) {
      var deferred = $q.defer();
      var token = 'Bearer ' + response.data.token;
      $http.defaults.headers.common.Authorization = token;
      localStorage.setItem('Token', token);
      localStorage.setItem('User', JSON.stringify(response.data.user));
      $state.go('chat');
      return deferred.promise;
    }

    function getToken() {
      return $http.defaults.headers.common.Authorization;
    }

    function usersOnline() {
      var deferred = $q.defer();

      $http.get(baseUrl + '/users/')
        .then(function(response, status, headers, config) {
          deferred.resolve(response.data);
        }, function(status) {
          deferred.reject(status);
        });

      return deferred.promise;
    }
  }
})();
