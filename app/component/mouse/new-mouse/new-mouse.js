'use strict';

module.exports = {
  template: require('./new-mouse.html'),
  controller: ['$log', '$http','$rootScope', 'mouseService', NewMouseController],
  controllerAs: 'newMouseCtrl',
  bindings: {
    project: '<',
  },
};

function NewMouseController($log, $http, $rootScope, mouseService){
  $log.debug('init newmouseCtrl');

  this.mouse = {};

  this.createNewMouse = function() {
    $log.debug('init createNewMouse()');
    mouseService.createMouse(this.cage._id, this.mouse)
    .then( mouse => {
      this.mouse = mouse;
      this.mouse.name = null;
    });
  };

}
