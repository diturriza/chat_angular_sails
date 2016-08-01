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
