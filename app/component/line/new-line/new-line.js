'use strict';

module.exports = {
  template: require('./new-line.html'),
  controller: ['$log', '$http','$rootScope', 'lineService', NewLineController],
  controllerAs: 'newLineCtrl',
  bindings: {
    project: '<',
  },
};

function NewLineController($log, $http, $rootScope, lineService){
  $log.debug('init newLineCtrl');

  this.line = {};

  this.createNewLine = function() {

    lineService.createLine(this.project._id, this.line)
    .then(() => {
      this.line.name = null;
    });
  };

}
