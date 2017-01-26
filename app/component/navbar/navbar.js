'use strict';

require('./_navbar.scss');

module.exports = {
  template: require('./navbar.html'),
  controller: ['$log', '$location', '$rootScope', '$window', '$uibModal', 'authService', NavbarController],
  controllerAs: 'navbarCtrl',
};

function NavbarController($log, $location, $rootScope, $window, $uibModal, authService) {
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
