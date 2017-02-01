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
    $log.debug('init createNewLine()');
    lineService.createLine(this.project._id, this.line)
    .then( line => {
      this.line = line;
      this.line.name = null;
      this.line.gene1 = null;
      this.line.gene2 = null;
      this.line.gene3 = null;
      this.line.geneExpectedTotalPups = null;
      this.line.geneExpectedUsablePups = null;
    });
  };

}
