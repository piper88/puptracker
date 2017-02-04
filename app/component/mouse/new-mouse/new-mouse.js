'use strict';

module.exports = {
  template: require('./new-mouse.html'),
  controller: ['$log', '$http','$rootScope', 'mouseService', NewMouseController],
  controllerAs: 'newMouseCtrl',
  bindings: {
    cage: '<',
  },
};

function NewMouseController($log, $http, $rootScope, mouseService){
  $log.debug('init newMouseCtrl');

  this.mouse = {};

  this.createNewMouse = function() {
    $log.debug('init createNewMouse()');
    mouseService.createMouse(this.cage._id, this.mouse)
    .then( mouse => {
      this.mouse = mouse;
      // this.mouse.name = null;
    });
  };

}
