'use strict';

module.exports = {
  template: require('./edit-cage.html'),
  controller: ['$log', 'cageService', EditCageController],
  controllerAs: 'editCageCtrl',
  bindings: {
    cage: '<',
    line: '<',
  },
};

function EditCageController($log, cageService){
  $log.debug('init editCageCtrl');

  this.updateCage = function(){
    $log.debug('editCageCtrl.updateCage()');
    cageService.updateCage(this.line, this.cage);
  };
}
