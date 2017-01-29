'use strict';

require('./_navbar.scss');

module.exports = {
  template: require('./navbar.html'),
  controller: ['$log', '$location', '$rootScope', 'authService', NavbarController],
  controllerAs: 'navbarCtrl',
  bindings: {
    project: '<',
  },
};

function NavbarController($log, $location, $rootScope, authService) {
  $log.debug('init navbarCtrl');

  this.logout = function() {
    $log.debug('navbarCtrl.logout()');
    authService.logout()
      .then(() => {
        $location.url('/');
        console.log('logged out');
      });
  };

}
