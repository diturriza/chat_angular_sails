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
