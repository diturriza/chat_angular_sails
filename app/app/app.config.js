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
