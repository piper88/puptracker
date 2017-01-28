'use strict';

module.exports = {
  template: require('./signup.html'),
  controller: ['$log', '$location', 'authService', SignupController],
  controllerAs: 'signupCtrl',
  bindings: {
    loginSuccess: '&',
  },
};

function SignupController($log, $location, authService){
  this.signup = function(user){
    authService.signup(user)
    .then(() => {
      $location.path('/home');
      this.loginSuccess();
    })
    .catch(() => {
      $log.debug('Signup Failed');
    });
  };
}
