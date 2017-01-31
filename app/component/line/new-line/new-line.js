'use strict';

require('./_new-line.scss');

module.exports = {
  template: require('./new-line.html'),
  controller: ['$log', '$http', 'lineService', NewLineController],
  controllerAs: 'newLineCtrl',
  bindings: {
    project: '<',
  },
};

function NewLineController($log, $http, lineService){
  $log.debug('init newLineCtrl');

  console.log('the current project', this.project);

  this.line = {};

  this.createNewLine = function() {
    $log.debug('init createNewLine()');
    // $log.debug('the line just created', this.line);
    lineService.createLine(this.project._id, this.line)
    .then((line)=> {
      $log.debug('the line just created', line);
      // this.line.name = null;
      // this.line.gene1 = null;
      // this.line.gene2 = null;
      // this.line.gene3 = null;
      // this.line.geneExpectedTotalPups = null;
      // this.line.geneExpectedUsablePups = null;

    });
  };

}
