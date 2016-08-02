(function() {
  'use strict';

  angular
    .module('chat', ['ui.router',
      'ngSanitize',
      'ngCookies',
      'ncy-angular-breadcrumb',
      'ngAnimate',
      'ngMessages',
      'toastr',
      'angularSpinner'
    ]);
})();

(function() {

  angular
    .module('chat')
    .constant(_, '_')
    .constant('baseUrl', 'http://192.168.3.101:1337');
}());

(function() {

  angular
    .module('chat')
    .config(appConfig);

  appConfig.$inject = ['$stateProvider', 'baseUrl', 'usSpinnerConfigProvider'];

  function appConfig($stateProvider, baseUrl, usSpinnerConfigProvider) {

    var spinnerOpt = {
      color: '#2196F3'
    }
    usSpinnerConfigProvider.setTheme('blue', spinnerOpt);
  }

}());

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

(function() {
  'use strict';

  angular
    .module('chat')
    .controller('loginController', loginController);

  loginController.$inject = ['dataService', '$state', 'usSpinnerService'];

  /* @ngInject */
  function loginController(dataService, $state, usSpinnerService) {
    var vm = this;
    vm.login = login;
    vm.logout = logout;
    vm.user = {
    };
    activate();

    function activate() {
      usSpinnerService.stop('spinnerGeneric');
      //console.log('login View activate');
    }

    function login() {
      //console.log("login function");
      dataService.login(vm.user).then(function(data) {
        //console.log("login");
        $state.go('dashboard');
      },function (err) {
        //console.log(err);
      });
    }

    function logout() {
      dataService.logout();
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('chat')
    .controller('registerController', registerController);

  registerController.$inject = ['dataService', '$state', 'usSpinnerService'];

  /* @ngInject */
  function registerController(dataService, $state, usSpinnerService) {
    var vm = this;
    vm.register = register;
    vm.user = {
    };
    activate();

    function activate() {
      usSpinnerService.stop('spinnerGeneric');
      //console.log('register View activate');
    }

    function register() {
      //console.log("register function");
      dataService.register(vm.user).then(function(data) {
        $state.go('dashboard');
      },function (err) {
        //console.log(err);
      });
    }
  }
})();

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
