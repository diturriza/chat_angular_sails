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
