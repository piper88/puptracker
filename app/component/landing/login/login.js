'use strict';

require('./_login.scss');

module.exports = {
  template: require('./login.html'),
  controller: ['$log', '$location', 'authService', LoginController],
  controllerAs: 'loginCtrl',
  bindings: {
    loginSuccess: '&',
  },
};

function LoginController($log, $location, authService){
  $log.debug('init loginCtrl');

  this.isVisible = false;

  this.showLabel = function() {
    this.isVisible = true;
  };

  this.login = function(){
    $log.debug('loginCtrl.login()');

    authService.login(this.user)
    .then(() => {
      $location.url('/home');
      this.loginSuccess();
    });
  };

}
