'use strict';

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

  this.cage = {};

  // this.pickDate = function() {
  //   $log.debug('init pickDate');
  //   this.datetimepicker();
  // };

  this.createNewCage = function(){
    $log.debug('init createNewCage()');
    cageService.createCage(this.line, this.cage)
    .then( cage => {
      this.cage = cage;
      $log.debug('Sucessfully created cage');
    });
  };
}
