'use strict';

module.exports = {
  template: require('./edit-mouse.html'),
  controller: ['$log', 'mouseService', EditMouseController],
  controllerAs: 'editMouseCtrl',
  bindings: {
    mouse: '<',
    cage: '<',
  },
};

function EditMouseController($log, mouseService){
  $log.debug('init editmouseCtrl');

  this.updateMouse = function(){
    mouseService.updateMouse(this.cage, this.mouse);
  };
}
