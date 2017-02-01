'use strict';

require('./_new-cage.scss');

module.exports = {
  template: require('./new-cage.html'),
  controller: ['$log', '$http', '$rootScope', 'cageService',  NewCageController],
  controllerAs: 'newCageCtrl',
  bindings: {
    line: '<',
  },
};

function NewCageController($log, $http, $rootScope, cageService){
  $log.debug('init newCageCtrl');

  // this.pickDate = function() {
  //   $log.debug('init pickDate');
  //   this.datetimepicker();
  // };

  this.createNewCage = function(){
    $log.debug('init createNewCage()');
    cageService.createCage(this.line, this.cage)
    .then( () => {
      $log.debug('Sucessfully created cage');
    });
  };
}
