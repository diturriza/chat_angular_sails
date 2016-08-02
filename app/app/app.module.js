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
