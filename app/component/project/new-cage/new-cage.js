'use strict';

require('./_new-cage.scss');

module.exports = {
  template: require('./new-cage.html'),
  controller: ['$log', '$http', 'cageService', NewCageController],
  controllerAs: 'newCageCtrl',
  bindings: {
    projectData: '<',
    lineData: '<',
  },
};

function NewCageController($log, $http, cageService){
  $log.debug('init newCageCtrl');

  this.createNewCage = function(cage){
    $log.debug('init createNewCage()');
    cageService.createCage(cage)
    .then(() => {
      $log.debug('created new cage');
    });
  };

  this.deleteCage = function(cage){
    $log.debug('init deleteCage()');
    cageService.deleteCage(cage)
    .then(() => {
      $log.debug('deleted cage');
    });
  };

  this.fetchCages = function() {
    $log.debug('init fetchCages()');
    cageService.fetchCages(this.lineData)
    .then(data => {
      this.cages = data;
    });
  };

  this.fetchCages();
}
