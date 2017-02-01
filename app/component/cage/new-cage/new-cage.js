'use strict';

require('./_new-cage.scss');

module.exports = {
  template: require('./new-cage.html'),
  controller: ['$log', '$http', '$rootScope', 'cageService',  NewCageController],
  controllerAs: 'newCageCtrl',
  bindings: {
    project: '<',
    line: '<',
  },
};

function NewCageController($log, $http, $rootScope, cageService){
  $log.debug('init newCageCtrl');

  console.log('the current line in the new cage controller', this.line);
  console.log('the current project in the new cage controller', this.project);

  this.cage = {};
  this.line = {};

  // this.pickDate = function() {
  //   $log.debug('init pickDate');
  //   this.datetimepicker();
  // };

  this.createNewCage = function(){
    $log.debug('init createNewCage()');
    cageService.createCage(this.cage, this.project._id, this.line._id)
    .then((cage) => {
      $log.debug('the cage just created', cage);
    });
  };

  this.deleteCage = function(cage){
    $log.debug('init deleteCage()');
    cageService.deleteCage(cage)
    .then(() => {
      $log.debug('deleted cage');
    });
  };

  // this.fetchCages = function() {
  //   $log.debug('init fetchCages()');
  //   cageService.fetchCages(this.lineData)
  //   .then(data => {
  //     this.cages = data;
  //   });
  // };

  $rootScope.$on('$locationChangeSuccess', () => {
    this.fetchCages();
  });

  // this.fetchCages();
}
