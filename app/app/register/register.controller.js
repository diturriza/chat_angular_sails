(function() {
  'use strict';

  angular
    .module('chat')
    .controller('registerController', registerController);

  registerController.$inject = ['dataService', '$state'];

  /* @ngInject */
  function registerController(dataService, $state) {
    var vm = this;
    vm.register = register;
    vm.user = {
    };
    activate();

    function activate() {
      console.log('register View activate');
    }

    function register() {
      console.log("register function");
      dataService.register(vm.user).then(function(data) {
        $state.go('dashboard');
      },function (err) {
        console.log(err);
      });
    }
  }
})();
