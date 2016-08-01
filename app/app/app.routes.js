(function() {

  angular.module('chat').config(appConfig);

  appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function appConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('chat', {
        url: '/chat',
        views: {
          "main": {
            controller: 'chatController',
            controllerAs: 'vm',
            templateUrl: 'app/chat/chat.html'
          }
        },
        authenticate: true
      })
      .state('register', {
        url: '/register',
        views: {
          "main": {
            controller: 'registerController',
            controllerAs: 'vm',
            templateUrl: 'app/register/register.html'
          }
        },
        authenticate: false
      })
      .state('login', {
        url: '/login',
        views: {
          "main": {
            controller: 'loginController',
            controllerAs: 'vm',
            templateUrl: 'app/login/login.html'
          }
        },
        authenticate: false
      });

    $urlRouterProvider.otherwise('/register');
  }
})();
