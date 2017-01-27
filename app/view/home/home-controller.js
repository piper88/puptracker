'use strict';

require('./_home.scss');

module.exports = ['$log', 'lineService', HomeController];

function HomeController($log, lineService){
  $log.debug('init homeCtrl');

  this.currentProject;
  this.lines = [];

  this.fetchLines = function() {
    $log.debug('init homeCtrl.fetchLines()');
    lineService.fetchLines(this.project._id)
    .then( lines => {
      this.lines = lines;
      this.currentLine = lines[0];
      $log.debug('Succesfully found line');
    });
  };


  this.showMe = function(){
    this.show=true;
  };
}
