(function() {
  'use strict';

  angular
    .module('chat', ['ui.router',
      'ngSanitize',
      'ngCookies',
      'ncy-angular-breadcrumb',
      'ngAnimate',
      'ngMessages',
      'toastr'
    ]);
})();

(function() {

  angular
    .module('chat')
    .constant(_, '_')
    .constant('baseUrl', 'http://192.168.3.102:1337');
}());

(function() {

  angular
    .module('chat')
    .config(appConfig);

  appConfig.$inject = ['$stateProvider', 'baseUrl'];

  function appConfig($stateProvider, baseUrl) {
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

(function() {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['dataService', 'Pagination', '$state', 'usSpinnerService'];

    /* @ngInject */
    function loginController(dataService, Pagination, $state, usSpinnerService) {
        var vm = this;
        vm.pagination = Pagination.getNew(4);
        vm.viewSpace = viewSpace;

        activate();

        function activate() {
          console.log('login View activate');
          usSpinnerService.stop('spinner-1');
        }
        function viewSpace(id) {
          console.log(id);
          $state.go('login',{
            spaceId : id
          });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app')
        .controller('registerController', registerController);

    registerController.$inject = ['dataService', 'Pagination', '$state', 'usSpinnerService'];

    /* @ngInject */
    function registerController(dataService, Pagination, $state, usSpinnerService) {
        var vm = this;
        vm.pagination = Pagination.getNew(4);
        vm.viewSpace = viewSpace;

        activate();

        function activate() {
          console.log('register View activate');
          usSpinnerService.stop('spinner-1');
        }
        function viewSpace(id) {
          console.log(id);
          $state.go('register',{
            spaceId : id
          });
        }
    }
})();

(function() {
  'use strict';

  angular
    .module('chat')
    .factory('dataService', dataService);

  dataService.$inject = ['$http', 'baseUrl', '$q', '$state'];

  /* @ngInject */
  function dataService($http, baseUrl, $q, $state) {
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

    function logout() {
      $http.defaults.headers.common.Authorization = '';
      localStorage.removeItem('Token');
      $state.go('register');
    }

    function setAuthenticatedAccount(response) {
      var deferred = $q.defer();
      console.log(response.data.token);
      var token = 'Bearer ' + response.data.token;
      $http.defaults.headers.common.Authorization = token;
      localStorage.setItem('Token', token);
      localStorage.setItem('User', response.data.user);
      $state.go('dashboard');
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

(function() {
    'use strict';

    angular
        .module('chat')
        .directive('headerDirective', headerDirective);

    function headerDirective() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/components/header/header.html',
            controller: headerController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }

    headerController.$inject = [];

    /* @ngInject */
    function headerController() {
        var vm = this;

        activate();

        function activate() {
          console.log('header Activate');
        }
    }
})();
