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

    headerController.$inject = ['dataService'];

    /* @ngInject */
    function headerController(dataService) {
        var vm = this;
        vm.logout = logout;

        activate();

        function activate() {
          console.log('header Activate');
        }
        function logout() {
          dataService.logout();
        }
    }
})();
