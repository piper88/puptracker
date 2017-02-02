'use strict';

module.exports = {
  template: require('./cage-li.html'),
  controller: ['$log', 'cageService', cageLIController],
  controllerAs: 'cageLICtrl',
  bindings: {
    line: '<',
    deleteCageCheck: '<',
    cage: '<',
  },
};

function cageLIController($log, cageService){
  $log.debug('init cageLiCtrl');

  this.showEditCage= false;

  this.deleteCage = function(){
    cageService.deleteCage(this.cage._id, this.cage.lineId);
  };

}
