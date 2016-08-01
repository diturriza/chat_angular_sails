(function() {
  'use strict';

  angular
    .module('chat')
    .controller('loginController', loginController);

  loginController.$inject = ['dataService', '$state'];

  /* @ngInject */
  function loginController(dataService, $state) {
    var vm = this;
    vm.login = login;
    vm.logout = logout;
    vm.user = {
    };
    activate();

    function activate() {
      console.log('login View activate');
    }

    function login() {
      console.log("login function");
      dataService.login(vm.user).then(function(data) {
        console.log("login");
        $state.go('dashboard');
      },function (err) {
        console.log(err);
      });
    }

    function logout() {
      dataService.logout();
    }
  }
})();
