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
